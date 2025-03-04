import { auth } from "@/auth";
import { db } from "@/lib/firebase";
import { Category } from "@/types-db";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req : Request,
    {params}:{params: Promise<{storeId: string, categoryId: string}>}
) => {
    try {
        const {storeId , categoryId} = await params;
        const session = await auth()
        const body = await req.json()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        const {name, billboardId, billboardLabel} = body;

        if(!name){
            return new NextResponse("Category Name is missing!",{status: 400})
        }

        if(!billboardId){
            return new NextResponse("Billboard Id is missing!",{status: 400})
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

        const categoryRef = await getDoc(
            doc(db, "stores", storeId, "categories", categoryId)
        )
        
        if(categoryRef.exists()){
            await updateDoc(
                doc(db, "stores", storeId, "categories", categoryId), {
                    ...categoryRef.data(),
                    name,
                    billboardId,
                    billboardLabel,
                    updateAt: serverTimestamp()
                }
            )
        }else{
            return new NextResponse("Category Not Found", {status: 404})
        }

        const category = (
            await getDoc(
                doc(db, "stores", storeId, "categories", categoryId)
            )
        ).data() as Category
        
        return NextResponse.json(category)

    } catch (error) {
        console.log(`CATEGORIES_PATCH:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}


export const DELETE = async (req : Request,
    {params}:{params:Promise<{storeId: string, categoryId: string}>}
) => {
    try {
        const {storeId, categoryId} = await params;
        const session = await auth()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        if(!categoryId){
            return new NextResponse("Category Id is missing",{status:400})
        }

        const store = await getDoc(doc(db, "stores", storeId))

        if(store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== session.user.email){
                return new NextResponse("Un-Authorized Access")
            }
        }

        const categoryRef = doc(db, "stores", storeId, "categories", categoryId)
        
        await deleteDoc(categoryRef)
        
        return NextResponse.json({msj: "Category Deleted"})

    } catch (error) {
        console.log(`CATEGORIES_DELETE:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}