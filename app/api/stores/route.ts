import { auth } from "@/auth"
import { db } from "@/lib/firebase"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { NextResponse } from "next/server"

export const POST = async ( req : Request ) => {
    try {
        const session = await auth()
        const body = await req.json()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        const {name} = body;

        if(!name){
            return new NextResponse("Store Name is missing!",{status: 400})
        }

        const storeData = {
            name,
            userId: session.user.email,
            createdAt : serverTimestamp()
        }

        const storeRef = await addDoc(collection(db, "stores"), storeData);

        const id = storeRef.id;

        await updateDoc(doc(db, "stores", id),{
            ...storeData,
            id,
            updateAt: serverTimestamp()
        })

        return NextResponse.json({id, ...storeData});

    } catch (error) {
        console.log(`STORES_POST:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}