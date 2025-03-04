import { db } from "@/lib/firebase";
import { Cuisine } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { KitchenForm } from "./components/kitchen-form";

const KitchenPage = async ({
  params,
}: {
  params: Promise<{
    storeId: string;
    kitchenId: string;
  }>
}) => {
  const {storeId,kitchenId} = await params;
  const kitchen = (
    await getDoc(
      doc(db, "stores", storeId, "kitchens", kitchenId)
    )
  ).data() as Cuisine;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <KitchenForm initialData={kitchen} />
      </div>
    </div>
  );
};

export default KitchenPage;
