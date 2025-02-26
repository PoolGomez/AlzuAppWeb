import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types-db";
import { format } from "date-fns"
import { ProductColumns } from "./components/columns";
import { ProductClient } from "./components/client";
import { formatter } from "@/lib/utils";


const ProductsPage = async ({params}:{params:Promise<{storeId: string}>}) => {

    const {storeId} = await params;
    const productsData = (
        await getDocs(
            collection(doc(db, "stores", storeId), "products")
        )
    ).docs.map(doc => doc.data()) as Product[];

    const formattedProducts : ProductColumns[] = productsData.map(item => ({
        id: item.id,
        name: item.name,
        price: formatter.format(item.price),
        isArchived: item.isArchived,
        isFeatured: item.isFeatured,
        category: item.category,
        size: item.size,
        cuisine: item.cuisine,
        kitchen: item.kitchen,
        images: item.images,
        createdAt: item.createdAt 
            ? format(item.createdAt.toDate(),"MMMM do, yyyy") 
            : "",
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts}/>
            </div>
            
        </div>
    )
}

export default ProductsPage;