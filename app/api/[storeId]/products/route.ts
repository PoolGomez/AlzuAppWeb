import { auth } from "@/auth";
import { db } from "@/lib/firebase";
import { Product } from "@/types-db";
import { addDoc, and, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";

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

        const {
            value,
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

        if(!value){
            return new NextResponse("Product Value is missing!",{status: 400})
        }

        if(!name){
            return new NextResponse("Product Name is missing!",{status: 400})
        }

        if(!images || !images.length){
            return new NextResponse("Images are required!",{status: 400})
        }
        if(!category){
            return new NextResponse("Category is missing!",{status: 400})
        }
        if(!size){
            return new NextResponse("Size is missing!",{status: 400})
        }
        if(!cuisine){
            return new NextResponse("Cuisine is missing!",{status: 400})
        }
        if(!kitchen){
            return new NextResponse("Kitchen is missing!",{status: 400})
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
                return new NextResponse("Un-Authorized Access",{status: 500})
            }

            const productsRef = collection(db, "stores",storeId,"products");
            const querySnapShot = await getDocs( query(productsRef, where("value","==", value)) )
            if(querySnapShot.size > 0){
                return new NextResponse("El value ya esta siendo utilizado por otro producto.",{status: 400})
            }
        }
        

        
        const productData = {
            value,
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
            collection(db, "stores", storeId, "products"),
            productData
        )
        const id = productRef.id

        await updateDoc(doc(db, "stores", storeId, "products", id),{
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
    {params}:{params:Promise<{storeId: string}>}
) => {
    try {
        const {storeId} = await params;
        if(!storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }

        // get the srachParams from the req.url
        const {searchParams} = new URL(req.url)

        const productRef = collection(doc(db, "stores", storeId), "products")

        let productQuery

        const queryContraints = []

        // construct the query based on the searchParameters
        if(searchParams.has("size")){
            queryContraints.push(where("size","==", searchParams.get("size")))
        }
        if(searchParams.has("category")){
            queryContraints.push(where("category","==", searchParams.get("category")))
        }
        if(searchParams.has("kitchen")){
            queryContraints.push(where("kitchen","==", searchParams.get("kitchen")))
        }
        if(searchParams.has("cuisine")){
            queryContraints.push(where("cuisine","==", searchParams.get("cuisine")))
        }
        if(searchParams.has("isFeatured")){
            queryContraints.push(
                where(
                    "isFeatured",
                    "==", 
                    searchParams.get("isFeatured") === "true" ? true : false 
                )
            )
        }
        if(searchParams.has("isArchived")){
            queryContraints.push(
                where(
                    "isArchived",
                    "==", 
                    searchParams.get("isArchived") === "true" ? true : false 
                )
            )
        }

        if(queryContraints.length > 0){
            productQuery = query(productRef, and(...queryContraints))
        }else{
            productQuery = query(productRef)
        }

        // execute the query
        const querySnapshot = await getDocs(productQuery)

        const productData : Product[] = querySnapshot.docs.map(doc=>doc.data() as Product)

        return NextResponse.json(productData)

    } catch (error) {
        console.log(`PRODUCTS_GET:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}