import { db } from "@/lib/firebase";
import { Billboards } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req : Request,
    {params}:{params:Promise<{storeId: string, billboardId: string}>}
) => {
    try {
        console.log("API_PATCH_BILLBOARD")
        const {storeId, billboardId} = await params;
        const {userId} = await auth()
        const body = await req.json()

        if(!userId){
            return new NextResponse("Un-Authorized",{status:400})
        }

        const {label, imageUrl} = body;

        if(!label){
            return new NextResponse("Billboard Name is missing!",{status: 400})
        }

        if(!imageUrl){
            return new NextResponse("ImageUrl is missing!",{status: 400})
        }

        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        if(!billboardId){
            return new NextResponse("Billboard Id is missing",{status:400})
        }

        const store = await getDoc(doc(db, "stores", storeId))

        if(store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== userId){
                return new NextResponse("Un-Authorized Access")
            }
        }

        const billboardRef = await getDoc(
            doc(db, "stores", storeId, "billboards", billboardId)
        )
        
        if(billboardRef.exists()){
            await updateDoc(
                doc(db, "stores", storeId, "billboards", billboardId), {
                    ...billboardRef.data(),
                    label,
                    imageUrl,
                    updateAt: serverTimestamp()
                }
            )
        }else{
            return new NextResponse("Billboard Not Found", {status: 404})
        }

        const billboard = (
            await getDoc(
                doc(db, "stores", storeId, "billboards", billboardId)
            )
        ).data() as Billboards
        
        return NextResponse.json(billboard)

    } catch (error) {
        console.log(`BILLBOARD_POST:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}


export const DELETE = async (req : Request,
    {params}:{params:Promise<{storeId: string, billboardId: string}>}
) => {
    try {
        const {storeId, billboardId} = await params;
        const {userId} = await auth()

        if(!userId){
            return new NextResponse("Un-Authorized",{status:400})
        }

        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        if(!billboardId){
            return new NextResponse("Billboard Id is missing",{status:400})
        }

        const store = await getDoc(doc(db, "stores", storeId))

        if(store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== userId){
                return new NextResponse("Un-Authorized Access")
            }
        }

        const billboardRef = doc(db, "stores", storeId, "billboards", billboardId)
        
        await deleteDoc(billboardRef)
        
        return NextResponse.json({msj: "Billboard Deleted"})

    } catch (error) {
        console.log(`BILLBOARD_POST:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}