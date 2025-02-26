import { db } from "@/lib/firebase";
import { Order } from "@/types-db";
import { collection, doc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export const GET = async (req : Request,
    {params}:{params:Promise<{storeId: string}>}
) => {
    try {
        const {storeId} = await params;
        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        const ordersData = (
            await getDocs(
                collection(doc(db, "stores", storeId), "orders")
            )
        ).docs.map(doc=>doc.data()) as Order[];

        return NextResponse.json(ordersData)
        

    } catch (error) {
        console.log(`ORDERS_GET:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}