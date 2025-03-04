import { db } from "@/lib/firebase";
import { Cuisine } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { CuisineForm } from "./components/cuisine-form";

const CuisinePage = async ({
  params,
}: {
  params: Promise<{
    storeId: string;
    cuisineId: string;
  }>
}) => {
  const {storeId, cuisineId} = await params;
  const cuisine = (
    await getDoc(
      doc(db, "stores", storeId, "cuisines", cuisineId)
    )
  ).data() as Cuisine;
  
    const parseCuisineData = (data:Cuisine) => {
         return {
           id: data.id,
           name:data.name,
           value: data.value,
         }
     }
   
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CuisineForm initialData={parseCuisineData(cuisine)} />
      </div>
    </div>
  );
};

export default CuisinePage;
