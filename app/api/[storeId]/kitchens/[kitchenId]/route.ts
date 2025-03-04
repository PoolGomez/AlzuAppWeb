import { auth } from "@/auth";
import { db } from "@/lib/firebase";
import { Kitchen } from "@/types-db";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req : Request,
    {params}:{params:Promise<{storeId: string, kitchenId: string}>}
) => {
    try {
        const {storeId, kitchenId} = await params;
        const session = await auth()
        const body = await req.json()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        const {name, value} = body;

        if(!name){
            return new NextResponse("Kitchen Name is missing!",{status: 400})
        }

        if(!value){
            return new NextResponse("Kitchen Value is missing!",{status: 400})
        }

        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        const store = await getDoc(doc(db, "stores", storeId))

        if(store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== session.user.email){
                return new NextResponse("Un-Authorized Access")
            }
        }

        const kitchenRef = await getDoc(
            doc(db, "stores", storeId, "kitchens", kitchenId)
        )
        
        if(kitchenRef.exists()){
            await updateDoc(
                doc(db, "stores", storeId, "kitchens", kitchenId), {
                    ...kitchenRef.data(),
                    name,
                    value,
                    updateAt: serverTimestamp()
                }
            )
        }else{
            return new NextResponse("Kitchen Not Found", {status: 404})
        }

        const kitchen = (
            await getDoc(
                doc(db, "stores", storeId, "kitchens", kitchenId)
            )
        ).data() as Kitchen
        
        return NextResponse.json(kitchen)

    } catch (error) {
        console.log(`KITCHEN_PATCH:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}


export const DELETE = async (req : Request,
    {params}:{params:Promise<{storeId: string, kitchenId: string}>}
) => {
    try {
        const {storeId, kitchenId} = await params;
        const session = await auth()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        if(!kitchenId){
            return new NextResponse("Kitchen Id is missing",{status:400})
        }

        const store = await getDoc(doc(db, "stores", storeId))

        if(store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== session.user.email){
                return new NextResponse("Un-Authorized Access")
            }
        }

        const kitchenRef = doc(db, "stores", storeId, "kitchens", kitchenId)
        
        await deleteDoc(kitchenRef)
        
        return NextResponse.json({msj: "Kitchen Deleted"})

    } catch (error) {
        console.log(`KITCHEN_DELETE:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}