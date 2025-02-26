import Stripe from "stripe"
import { NextResponse } from "next/server"
import {stripe} from "@/lib/stripe"
import { Product } from "@/types-db";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const corsHeaders = {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":"GET,POST,PUT,DELETE, OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type, Authorization"
};

export const OPTIONS = async () => {
    return NextResponse.json({},{headers: corsHeaders});
};

export const POST = async (
    req: Request,
    {params}:{params:Promise<{ storeId: string}>}
)=>{
    const {storeId} = await params;
    const {products, userId} = await req.json();

    const line_items : Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    products.forEach((item: Product) =>{
        line_items.push({
            quantity: item.qty,
            price_data: {
                currency: "USD",
                product_data:{
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100)
            }
        });
    });

    // add the document to firebase
    const orderData = {
        isPaid: false,
        orderItems: products,
        userId,
        order_status: "Processing",
        createdAt: serverTimestamp()
    };

    const orderRef = await addDoc(
        collection(db, "stores", storeId, "orders"),
        orderData
    );

    const id = orderRef.id;

    await updateDoc(doc(db, "stores", storeId, "orders" , id), {
        ...orderData,
        id,
        updateAt: serverTimestamp()
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection:"required",
        shipping_address_collection:{
            allowed_countries:["US", "CA","GB","AU","IN"]
        },
        phone_number_collection:{
            enabled: true
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`,
        metadata: {
            orderId: id,
            storeId: storeId
        }
    });

    return NextResponse.json({url: session.url},{headers: corsHeaders });

}