import { auth } from "@/auth";
import { db, storage } from "@/lib/firebase";
import { Product } from "@/types-db";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const PATCH = async (req : Request,
    {params}:{params:Promise<{storeId: string, productId: string}>}
) => {
    try {
        const {storeId, productId} = await params;
        const session = await auth()
        const body = await req.json()

        if(!session){
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

        const productRef = await getDoc(
            doc(db, "stores", storeId, "products", productId)
        )
        
        if(productRef.exists()){
            await updateDoc(
                doc(db, "stores", storeId, "products", productId), {
                    ...productRef.data(),
                    name,
                    price,
                    images,
                    isFeatured,
                    isArchived,
                    category,
                    size,
                    kitchen,
                    cuisine,
                    updateAt: serverTimestamp()
                }
            )
        }else{
            return new NextResponse("Product Not Found", {status: 404})
        }

        const product = (
            await getDoc(
                doc(db, "stores", storeId, "products", productId)
            )
        ).data() as Product
        
        return NextResponse.json(product)

    } catch (error) {
        console.log(`PRODUCT_PATCH:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}
export const DELETE = async (req : Request,
    {params}:{params:Promise<{storeId: string, productId: string}>}
) => {
    try {
        const {storeId, productId} = await params;
        const session = await auth()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        if(!productId){
            return new NextResponse("Product Id is missing",{status:400})
        }

        const store = await getDoc(doc(db, "stores", storeId))

        if(store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== session.user.email){
                return new NextResponse("Un-Authorized Access")
            }
        }

        const productRef = doc(db, "stores", storeId, "products", productId)

        const productDoc = await getDoc(productRef)
        if(!productDoc.exists()){
            return new NextResponse("Product Not Found",{status:400})
        }

        //delete all the image from the storage
        const images = productDoc.data()?.images

        if(images && Array.isArray(images)){
            await Promise.all(
                images.map(async(image) =>{
                    const imageRef = ref(storage, image.url)
                    await deleteObject(imageRef)
                })
            )
        }
        
        await deleteDoc(productRef)
        
        return NextResponse.json({msj: "Product and associated images delete successfully"})

    } catch (error) {
        console.log(`PRODUCT_DELETE:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}

export const GET = async (req : Request,
    {params}:{params:Promise<{storeId: string, productId: string}>}
) => {
    try {

        const {storeId, productId} = await params;
        
        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }
        if(!productId){
            return new NextResponse("Product Id is missing",{status:400})
        }

        const product = (
            await getDoc(
                doc(db, "stores", storeId, "products", productId)
            )
        ).data() as Product;

        return NextResponse.json(product)

    } catch (error) {
        console.log(`PRODUCT_GET:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}
// export const GET = async (req : Request,
//     {params}:{params:{storeId: string, productId: string}}
// ) => {
//     try {
        
//         if(!params.storeId){
//             return new NextResponse("Store Id is missing",{status:400})
//         }
//         if(!params.productId){
//             return new NextResponse("Product Id is missing",{status:400})
//         }

        

//         const product = (
//             await getDoc(
//                 doc(db, "stores", params.storeId, "products", params.productId)
//             )
//         ).data() as Product
        
//         return NextResponse.json(product)

//     } catch (error) {
//         console.log(`PRODUCT_PATCH:${error}`)
//         return new NextResponse("Internal Server Error", { status : 500 })
//     }
// }
