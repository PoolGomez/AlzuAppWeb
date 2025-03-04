import { db } from "@/lib/firebase";
import { Billboards } from "@/types-db";
import { collection, doc, getDocs } from "firebase/firestore";
import { CreateCategoryForm } from "./components/create-category-form";


const CreateCategoryPage = async ({
  params,
}: {
  params: Promise<{
    storeId: string
  }>
}) => {
  const {storeId} = await params;
  
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
        <CreateCategoryForm billboards={billboardsData} />
      </div>
    </div>
  );
};

export default CreateCategoryPage;