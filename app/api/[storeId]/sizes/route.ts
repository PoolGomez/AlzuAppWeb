import { auth } from "@/auth";
import { db } from "@/lib/firebase";
import { Size } from "@/types-db";
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
            return new NextResponse("Size Name is missing!",{status: 400})
        }

        if(!value){
            return new NextResponse("Size Value is missing!",{status: 400})
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
        const sizeData = {
            name,
            value,
            createdAt: serverTimestamp()
        }

        const sizeRef = await addDoc(
            collection(db, "stores", storeId, "sizes"),
            sizeData
        )
        const id = sizeRef.id

        await updateDoc(doc(db, "stores", storeId, "sizes", id),{
            ...sizeData,
            id,
            updateAt: serverTimestamp()
        })
        return NextResponse.json({id, ...sizeData})
        

    } catch (error) {
        console.log(`SIZES_POST:${error}`)
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

        const sizesData = (
            await getDocs(
                collection(doc(db, "stores", storeId), "sizes")
            )
        ).docs.map(doc=>doc.data()) as Size[];

        return NextResponse.json(sizesData)
        

    } catch (error) {
        console.log(`SIZES_GET:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}