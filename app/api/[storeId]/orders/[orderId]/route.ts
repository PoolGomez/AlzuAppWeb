import { db } from "@/lib/firebase";
import { Category, Order, Size } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req : Request,
    {params}:{params:{storeId: string, orderId: string}}
) => {
    try {
        const {userId} = await auth()
        const body = await req.json()

        if(!userId){
            return new NextResponse("Un-Authorized",{status:400})
        }

        const {order_status} = body;

        if(!order_status){
            return new NextResponse("Order Status is required!",{status: 400})
        }

        if(!params.storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        if(!params.orderId){
            return new NextResponse("Order Id is missing",{status:400})
        }

        const store = await getDoc(doc(db, "stores", params.storeId))

        if(store.exists()){
            let storeData = store.data()
            if(storeData?.userId !== userId){
                return new NextResponse("Un-Authorized Access", {status: 403})
            }
        }

        const orderRef = await getDoc(
            doc(db, "stores", params.storeId, "orders", params.orderId)
        );

        
        if(orderRef.exists()){
            await updateDoc(
                doc(db, "stores", params.storeId, "orders", params.orderId), {
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
                doc(db, "stores", params.storeId, "orders", params.orderId)
            )
        ).data() as Order;
        
        return NextResponse.json(order)

    } catch (error) {
        console.log(`ORDER_PATCH:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}


export const DELETE = async (req : Request,
    {params}:{params:{storeId: string, orderId: string}}
) => {
    try {
        const {userId} = await auth()

        if(!userId){
            return new NextResponse("Un-Authorized",{status:400})
        }

        if(!params.storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        if(!params.orderId){
            return new NextResponse("Order is required",{status:400})
        }

        const store = await getDoc(doc(db, "stores", params.storeId))

        if(store.exists()){
            let storeData = store.data()
            if(storeData?.userId !== userId){
                return new NextResponse("Un-Authorized Access")
            }
        }

        const docRef = doc(db, "stores", params.storeId, "orders", params.orderId)
        
        await deleteDoc(docRef)
        
        return NextResponse.json({msj: "Order Deleted"})

    } catch (error) {
        console.log(`ORDER_DELETE:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}