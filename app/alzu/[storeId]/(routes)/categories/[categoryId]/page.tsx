import { db } from "@/lib/firebase";
import { Billboards, Category } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { CategoryForm } from "./components/category-form";
import { redirect } from "next/navigation";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{
    storeId: string,
    categoryId: string
  }>
}) => {
  const {storeId, categoryId} = await params;
  
  const category = (
    await getDoc(
      doc(db, "stores", storeId, "categories", categoryId)
    )
  ).data() as Category;

  if(!category){
    redirect(`/alzu/${storeId}/categories`)
  }

  const parseCategoryData = (data:Category) => {
      return {
        id: data.id,
        name:data.name,
        billboardId: data.billboardId,
        billboardLabel: data.billboardLabel,
      }
  }

  
  const billboardsData = (
    await getDocs(collection(doc(db, "stores", storeId), "billboards"))
  ).docs.map((doc) => 
    // doc.data()
    ({
      id: doc.id,
      label: doc.data().label
    })
  ) as Billboards[];
  

  


  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={parseCategoryData(category)} billboards={billboardsData} />
      </div>
    </div>
  );
};

export default CategoryPage;
