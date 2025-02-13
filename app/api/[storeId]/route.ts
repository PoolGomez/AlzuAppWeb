import { db } from "@/lib/firebase"
import { Store } from "@/types-db"
import { auth } from "@clerk/nextjs/server"
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { NextResponse } from "next/server"

export const PATCH = async ( req : Request,{params}:{params: {storeId: string}} ) => {
    try {
        const {userId} = await auth()
        const body = await req.json()

        if(!userId){
            return new NextResponse("Un-Authorized",{status:400})
        }

        if(!params.storeId){
            return new NextResponse("Store Id is Required",{status:400})
        }

        const {name} = body;

        if(!name){
            return new NextResponse("Store Name is missing!",{status: 400})
        }

        const docRef = doc(db, "stores", params.storeId)

        await updateDoc(docRef, {name})

        const store = (await getDoc(docRef)).data() as Store

        return NextResponse.json(store);

    } catch (error) {
        console.log(`STORES_PATCH:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}

export const DELETE = async ( req : Request,{params}:{params: {storeId: string}} ) => {
    try {
        const {userId} = await auth()

        if(!userId){
            return new NextResponse("Un-Authorized",{status:400})
        }

        if(!params.storeId){
            return new NextResponse("Store Id is Required",{status:400})
        }

        const docRef = doc(db, "stores", params.storeId)

        //TODO: Delete all the subcollections- and along with those data file un
        await deleteDoc(docRef)

        return NextResponse.json({msg: "Store and all of its sub-collection deleted"});

    } catch (error) {
        console.log(`STORES_DELETE:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}