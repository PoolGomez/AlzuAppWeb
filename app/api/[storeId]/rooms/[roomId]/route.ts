import { auth } from "@/auth";
import { db } from "@/lib/firebase";
import { Room } from "@/types-db";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req : Request,
    {params}:{params:Promise<{storeId: string, roomId: string}>}
) => {
    try {
        const {storeId, roomId} = await params;
        const session = await auth()
        const body = await req.json()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        const {name} = body;

        if(!name){
            return new NextResponse("Room Name is missing!",{status: 400})
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

        const roomRef = await getDoc(
            doc(db, "stores", storeId, "rooms", roomId)
        )
        
        if(roomRef.exists()){
            await updateDoc(
                doc(db, "stores", storeId, "rooms", roomId), {
                    ...roomRef.data(),
                    name,
                    updateAt: serverTimestamp()
                }
            )
        }else{
            return new NextResponse("Room Not Found", {status: 404})
        }

        const room = (
            await getDoc(
                doc(db, "stores", storeId, "rooms", roomId)
            )
        ).data() as Room
        
        return NextResponse.json(room)

    } catch (error) {
        console.log(`ROOM_PATCH:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}


export const DELETE = async (req : Request,
    {params}:{params:Promise<{storeId: string, roomId: string}>}
) => {
    try {
        const {storeId, roomId} = await params;
        const session = await auth()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        if(!roomId){
            return new NextResponse("Room Id is missing",{status:400})
        }

        const store = await getDoc(doc(db, "stores", storeId))

        if(store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== session.user.email){
                return new NextResponse("Un-Authorized Access")
            }
        }

        const roomRef = doc(db, "stores", storeId, "rooms", roomId)
        
        await deleteDoc(roomRef)
        
        return NextResponse.json({msj: "Room Deleted"})

    } catch (error) {
        console.log(`ROOM_DELETE:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}