import { db } from "@/lib/firebase";
import { Billboards, Category } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { CategoryForm } from "./components/category-form";

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

  const billboardsData = (
    await getDocs(collection(doc(db, "stores", storeId), "billboards"))
  ).docs.map((doc) => doc.data()) as Billboards[]


  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboardsData} />
      </div>
    </div>
  );
};

export default CategoryPage;
