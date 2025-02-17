import { db } from "@/lib/firebase";
import { Product } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req : Request,
    {params}:{params:{storeId: string}}
) => {
    try {
        const {userId} = await auth()
        const body = await req.json()

        if(!userId){
            return new NextResponse("Un-Authorized",{status:400})
        }

        const {
            name,
            price,
            images,
            isFeatured,
            isArchived,
            category,
            size,
            kitchen,
            cuisine
        } = body;

        if(!name){
            return new NextResponse("Size Name is missing!",{status: 400})
        }

        if(!images || !images.length){
            return new NextResponse("Images are required!",{status: 400})
        }
        if(!category){
            return new NextResponse("Category is missing!",{status: 400})
        }
        if(!price){
            return new NextResponse("Product price is missing!",{status: 400})
        }

        if(!params.storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        const store = await getDoc(doc(db, "stores", params.storeId))

        if(store.exists()){
            let storeData = store.data()
            if(storeData?.userId !== userId){
                return new NextResponse("Un-Authorized Access",{status: 500})
            }
        }
        const productData = {
            name,
            price,
            images,
            isFeatured,
            isArchived,
            category,
            size,
            kitchen,
            cuisine,
            createdAt: serverTimestamp()
        }

        const productRef = await addDoc(
            collection(db, "stores", params.storeId, "products"),
            productData
        )
        const id = productRef.id

        await updateDoc(doc(db, "stores", params.storeId, "products", id),{
            ...productData,
            id,
            // price,
            // images,
            // isFeatured,
            // isArchived,
            // category,
            // size,
            // kitchen,
            // cuisine,
            updateAt: serverTimestamp()
        })
        return NextResponse.json({id, ...productData})
        

    } catch (error) {
        console.log(`PRODUCT_POST:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}

export const GET = async (req : Request,
    {params}:{params:{storeId: string}}
) => {
    try {

        if(!params.storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        const productsData = (
            await getDocs(
                collection(doc(db, "stores", params.storeId), "products")
            )
        ).docs.map(doc=>doc.data()) as Product[];

        return NextResponse.json(productsData)
        

    } catch (error) {
        console.log(`PRODUCTS_GET:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}