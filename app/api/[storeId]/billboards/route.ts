import { auth } from "@/auth";
import { db } from "@/lib/firebase";
import { Billboards } from "@/types-db";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req : Request,
    {params}:{params:Promise<{storeId: string}>}
) => {
    try {
        const { storeId } = await params;
        const session = await auth()
        const body = await req.json()

        if(!session){
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

        const store = await getDoc(doc(db, "stores", storeId))

        if(store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== session.user.email){
                return new NextResponse("Un-Authorized Access")
            }
        }
        const billboardData = {
            label,
            imageUrl,
            createdAt: serverTimestamp()
        }

        const billboardRef = await addDoc(
            collection(db, "stores", storeId, "billboards"),
            billboardData
        )
        const id = billboardRef.id

        await updateDoc(doc(db, "stores", storeId, "billboards", id),{
            ...billboardData,
            id,
            updateAt: serverTimestamp()
        })
        return NextResponse.json({id, ...billboardData})
        

    } catch (error) {
        console.log(`BILLBOARD_POST:${error}`)
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

        const billboardsData = (
            await getDocs(
                collection(doc(db, "stores", storeId), "billboards")
            )
        ).docs.map(doc=>doc.data()) as Billboards[];

        return NextResponse.json(billboardsData)
        

    } catch (error) {
        console.log(`BILLBOARD_GET:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}