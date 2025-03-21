import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Category } from "@/types-db";
import { format } from "date-fns"
import { CategoryColumns } from "./components/columns";
import { CategoryClient } from "./components/client";


const CategoriesPage = async ({params}:{params:Promise<{storeId: string}>}) => {

    const {storeId} = await params;
    const categoriesData = (
        await getDocs(
            collection(doc(db, "stores", storeId), "categories")
        )
    ).docs.map(doc => doc.data()) as Category[];

    const formattedCategories : CategoryColumns[] = categoriesData.map(item => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboardLabel,
        createdAt: item.createdAt ? format(item.createdAt.toDate(),"MMMM do, yyyy") : ""
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formattedCategories}/>
            </div>
            
        </div>
    )
}

export default CategoriesPage;