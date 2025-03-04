import { auth } from "@/auth";
import { db } from "@/lib/firebase";
import { Cuisine } from "@/types-db";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req : Request,
    {params}:{params:Promise<{storeId: string}>}
) => {
    try {
        const {storeId} = await params;
        const session = await auth()
        const body = await req.json()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        const {name, value } = body;

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
            if(storeData?.userId !== session.user.email){
                return new NextResponse("Un-Authorized Access",{status: 500})
            }
        }
        const cuisineData = {
            name,
            value,
            createdAt: serverTimestamp()
        }

        const cuisineRef = await addDoc(
            collection(db, "stores", storeId, "cuisines"),
            cuisineData
        )
        const id = cuisineRef.id

        await updateDoc(doc(db, "stores", storeId, "cuisines", id),{
            ...cuisineData,
            id,
            updateAt: serverTimestamp()
        })
        return NextResponse.json({id, ...cuisineData})
        

    } catch (error) {
        console.log(`CUISINES_POST:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}

export const GET = async (req : Request,
    {params}:{params:Promise<{storeId: string}>}
) => {
    try {
        const {storeId} = await params;
        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        const cuisinesData = (
            await getDocs(
                collection(doc(db, "stores", storeId), "cuisines")
            )
        ).docs.map(doc=>doc.data()) as Cuisine[];

        return NextResponse.json(cuisinesData)
        

    } catch (error) {
        console.log(`CUISINES_GET:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}