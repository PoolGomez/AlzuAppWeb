import { auth } from "@/auth";
import { db } from "@/lib/firebase";
import { Size } from "@/types-db";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req : Request,
    {params}:{params:Promise<{storeId: string, sizeId: string}>}
) => {
    try {
        const {storeId, sizeId} = await params;
        const session = await auth()
        const body = await req.json()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        const {name, value} = body;

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
                return new NextResponse("Un-Authorized Access")
            }
        }

        const sizeRef = await getDoc(
            doc(db, "stores", storeId, "sizes", sizeId)
        )
        
        if(sizeRef.exists()){
            await updateDoc(
                doc(db, "stores", storeId, "sizes", sizeId), {
                    ...sizeRef.data(),
                    name,
                    value,
                    updateAt: serverTimestamp()
                }
            )
        }else{
            return new NextResponse("Size Not Found", {status: 404})
        }

        const size = (
            await getDoc(
                doc(db, "stores", storeId, "sizes", sizeId)
            )
        ).data() as Size
        
        return NextResponse.json(size)

    } catch (error) {
        console.log(`SIZE_PATCH:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}


export const DELETE = async (req : Request,
    {params}:{params:Promise<{storeId: string, sizeId: string}>}
) => {
    try {
        const {storeId, sizeId} = await params;
        const session = await auth()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        if(!sizeId){
            return new NextResponse("Size Id is missing",{status:400})
        }

        const store = await getDoc(doc(db, "stores", storeId))

        if(store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== session.user.email){
                return new NextResponse("Un-Authorized Access")
            }
        }

        const sizeRef = doc(db, "stores", storeId, "sizes", sizeId)
        
        await deleteDoc(sizeRef)
        
        return NextResponse.json({msj: "Size Deleted"})

    } catch (error) {
        console.log(`SIZE_DELETE:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}