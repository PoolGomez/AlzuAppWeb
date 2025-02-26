import { db } from "@/lib/firebase";
import { Cuisine } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req : Request,
    {params}:{params:Promise<{storeId: string, cuisineId: string}>}
) => {
    try {
        const {storeId, cuisineId} = await params;
        const {userId} = await auth()
        const body = await req.json()

        if(!userId){
            return new NextResponse("Un-Authorized",{status:400})
        }

        const {name, value} = body;

        if(!name){
            return new NextResponse("Cuisine Name is missing!",{status: 400})
        }

        if(!value){
            return new NextResponse("Cuisine Value is missing!",{status: 400})
        }

        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        const store = await getDoc(doc(db, "stores", storeId))

        if(store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== userId){
                return new NextResponse("Un-Authorized Access")
            }
        }

        const cuisineRef = await getDoc(
            doc(db, "stores", storeId, "cuisines", cuisineId)
        )
        
        if(cuisineRef.exists()){
            await updateDoc(
                doc(db, "stores", storeId, "cuisines", cuisineId), {
                    ...cuisineRef.data(),
                    name,
                    value,
                    updateAt: serverTimestamp()
                }
            )
        }else{
            return new NextResponse("Cuisine Not Found", {status: 404})
        }

        const cuisine = (
            await getDoc(
                doc(db, "stores", storeId, "cuisines", cuisineId)
            )
        ).data() as Cuisine
        
        return NextResponse.json(cuisine)

    } catch (error) {
        console.log(`CUISINE_PATCH:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}


export const DELETE = async (req : Request,
    {params}:{params:Promise<{storeId: string, cuisineId: string}>}
) => {
    try {
        const { storeId, cuisineId } = await params;
        const {userId} = await auth()

        if(!userId){
            return new NextResponse("Un-Authorized",{status:400})
        }

        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        if(!cuisineId){
            return new NextResponse("Cuisine Id is missing",{status:400})
        }

        const store = await getDoc(doc(db, "stores", storeId))

        if(store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== userId){
                return new NextResponse("Un-Authorized Access")
            }
        }

        const cuisineRef = doc(db, "stores", storeId, "cuisines", cuisineId)
        
        await deleteDoc(cuisineRef)
        
        return NextResponse.json({msj: "Cuisine Deleted"})

    } catch (error) {
        console.log(`CUISINE_DELETE:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}