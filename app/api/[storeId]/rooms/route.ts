import { db } from "@/lib/firebase";
import { Room } from "@/types-db";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// import { format } from "date-fns"
import { auth } from "@/auth";

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

        const {name } = body;

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
                return new NextResponse("Un-Authorized Access",{status: 500})
            }
        }
        const roomData = {
            name,
            createdAt: serverTimestamp()
        }

        const roomRef = await addDoc(
            collection(db, "stores", storeId, "rooms"),
            roomData
        )
        const id = roomRef.id

        await updateDoc(doc(db, "stores", storeId, "rooms", id),{
            ...roomData,
            id,
            updateAt: serverTimestamp()
        })
        return NextResponse.json({id, ...roomData})
        

    } catch (error) {
        console.log(`ROOM_POST:${error}`)
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

        const roomsData = (
            await getDocs(
                collection(doc(db, "stores", storeId), "rooms")
            )
        ).docs.map( doc =>  
            ({
                id: doc.id,
                name: doc.data().name,
            })
            // doc.data()

        ) as Room[];

        // const roomsParsed = roomsData.map(room =>({
        //     id: room.id,
        //     name: room.name,
        //     // createdAt: room.createdAt ? new Date(room.createdAt?.seconds * 1000) : ""
        //     // createdAt: room.createdAt 
        //     // ? format(room.createdAt.toDate(),"MMMM do, yyyy") 
        //     // : "",
        // }))

        return NextResponse.json(roomsData)
        

    } catch (error) {
        console.log(`ROOMS_GET:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}