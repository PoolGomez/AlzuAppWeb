import { db } from "@/lib/firebase";
import { Size } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { SizeForm } from "./components/size-form";
import { redirect } from "next/navigation";

const SizePage = async ({
  params,
}: {
  params: Promise<{
    storeId: string;
    sizeId: string;
  }>;
}) => {
  const { storeId, sizeId } = await params;
  const size = (
    await getDoc(doc(db, "stores", storeId, "sizes", sizeId))
  ).data() as Size;

  const parseSizeData = (data: Size) => {
    return {
      id: data.id,
      name: data.name,
      value: data.value,
    };
  };

  if (!size) {
    redirect(`/alzu/${storeId}/sizes`);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={parseSizeData(size)} />
      </div>
    </div>
  );
};

export default SizePage;
