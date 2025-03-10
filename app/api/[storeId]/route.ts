import { auth } from "@/auth"
import { db, storage } from "@/lib/firebase"
import { Store } from "@/types-db"
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import { NextResponse } from "next/server"

export const PATCH = async ( req : Request,
    {params}:{params: Promise<{storeId: string}>} 
) => {
    try {
        const {storeId} = await params;
        const session = await auth()
        const body = await req.json()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        if(!storeId){
            return new NextResponse("Store Id is Required",{status:400})
        }

        const {name} = body;

        if(!name){
            return new NextResponse("Store Name is missing!",{status: 400})
        }

        const docRef = doc(db, "stores", storeId)

        await updateDoc(docRef, {name})

        const store = (await getDoc(docRef)).data() as Store

        return NextResponse.json(store);

    } catch (error) {
        console.log(`STORES_PATCH:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}

export const DELETE = async ( 
    req : Request,
    {params}:{params:Promise<{storeId: string}>} ) => {
    try {
        const {storeId} = await params;
        const session = await auth()

        if(!session){
            return new NextResponse("Un-Authorized",{status:400})
        }

        if(!storeId){
            return new NextResponse("Store Id is Required",{status:400})
        }
        console.log("api delete: ", storeId)
        const docRef = doc(db, "stores", storeId)

        //TODO: Delete all the subcollections- and along with those data file un

        // billboards and its images
        const billboardsQuerySnapshot = await getDocs(
            collection(db, `stores/${storeId}/billboards` )
        )

        billboardsQuerySnapshot.forEach(async (billboardDoc) =>{
            await deleteDoc(billboardDoc.ref)

            // remove the images from the storage
            const imageUrl = billboardDoc.data().imageUrl
            if(imageUrl){
                const imageRef = ref(storage, imageUrl)
                await deleteObject(imageRef)
            }
        })

        // categories

        const categoriesQuerySnapshot = await getDocs(
            collection(db, `stores/${storeId}/categories` )
        )

        categoriesQuerySnapshot.forEach(async (categoryDoc) => {
            await deleteDoc(categoryDoc.ref)
        })

        // sizes

        const sizesQuerySnapshot = await getDocs(
            collection(db, `stores/${storeId}/sizes` )
        )

        sizesQuerySnapshot.forEach(async (sizeDoc) => {
            await deleteDoc(sizeDoc.ref)
        })

        //kitchens

        const kitchenQuerySnapshot = await getDocs(
            collection(db, `stores/${storeId}/kitchens` )
        )

        kitchenQuerySnapshot.forEach(async (kitchenDoc) => {
            await deleteDoc(kitchenDoc.ref)
        })

        // cuisines

        const cuisineQuerySnapshot = await getDocs(
            collection(db, `stores/${storeId}/cuisines` )
        )

        cuisineQuerySnapshot.forEach(async (cuisineDoc) => {
            await deleteDoc(cuisineDoc.ref)
        })

        // products and its images
        const productsQuerySnapshot = await getDocs(
            collection(db, `stores/${storeId}/products` )
        )

        productsQuerySnapshot.forEach(async (productDoc) =>{
            await deleteDoc(productDoc.ref)

            // remove the images from the storage
            const imagesArray = productDoc.data().images
            if(imagesArray && Array.isArray(imagesArray)){
                await Promise.all(
                    imagesArray.map(async (image) => {
                        const imageRef = ref(storage, image.url)
                        await deleteObject(imageRef)
                    })
                )
            }
        })

        // orders and its order items and its images
        const ordersQuerySnapshot = await getDocs(
            collection(db, `stores/${storeId}/orders`)
        )
        ordersQuerySnapshot.forEach(async (orderDoc) =>{

            await deleteDoc(orderDoc.ref)

            const ordersItemArray = orderDoc.data().orderItems
            if(ordersItemArray && Array.isArray(ordersItemArray)){
                await Promise.all(
                    ordersItemArray.map(async (orderItem) => {
                        const itemImagesArray = orderItem.images
                        if(itemImagesArray && Array.isArray(itemImagesArray)){
                            await Promise.all(
                                itemImagesArray.map(async (image) =>{
                                    const imageRef = ref(storage, image.url)
                                    await deleteObject(imageRef)
                                })
                            )
                        }
                    })
                )
            }
        })

        // finally deleting the store
        await deleteDoc(docRef)

        return NextResponse.json({msg: "Store and all of its sub-collection deleted"});

    } catch (error:any) {
        console.log(`STORES_DELETE: ${error.message}`, error)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}



