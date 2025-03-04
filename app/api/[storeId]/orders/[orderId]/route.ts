import { auth } from "@/auth";
import { db } from "@/lib/firebase";
import { Order } from "@/types-db";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req : Request,
    {params}:{params:Promise<{storeId: string, orderId: string}>}
) => {
    try {
        const {storeId,orderId} = await params;
        const session = await auth()
        const body = await req.json()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        const {order_status} = body;

        if(!order_status){
            return new NextResponse("Order Status is required!",{status: 400})
        }

        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        if(!orderId){
            return new NextResponse("Order Id is missing",{status:400})
        }

        const store = await getDoc(doc(db, "stores", storeId))

        if(store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== session.user.email){
                return new NextResponse("Un-Authorized Access", {status: 403})
            }
        }

        const orderRef = await getDoc(
            doc(db, "stores", storeId, "orders", orderId)
        );

        
        if(orderRef.exists()){
            await updateDoc(
                doc(db, "stores", storeId, "orders", orderId), {
                    ...orderRef.data(),
                    order_status,
                    updateAt: serverTimestamp()
                }
            )
        }else{
            return new NextResponse("Order Not Found", {status: 404})
        }

        const order = (
            await getDoc(
                doc(db, "stores", storeId, "orders", orderId)
            )
        ).data() as Order;
        
        return NextResponse.json(order)

    } catch (error) {
        console.log(`ORDER_PATCH:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}


export const DELETE = async (req : Request,
    {params}:{params:Promise<{storeId: string, orderId: string}>}
) => {
    try {
        const {storeId, orderId} = await params;
        const session = await auth()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        if(!orderId){
            return new NextResponse("Order is required",{status:400})
        }

        const store = await getDoc(doc(db, "stores", storeId))

        if(store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== session.user.email){
                return new NextResponse("Un-Authorized Access")
            }
        }

        const docRef = doc(db, "stores", storeId, "orders", orderId)
        
        await deleteDoc(docRef)
        
        return NextResponse.json({msj: "Order Deleted"})

    } catch (error) {
        console.log(`ORDER_DELETE:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}