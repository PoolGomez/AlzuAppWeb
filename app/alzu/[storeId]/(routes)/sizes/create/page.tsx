import { CreateSizeForm } from "./components/create-size-form";

const CreateSizePage = async () => {
//   const {storeId, sizeId} = await params;
//   const size = (
//     await getDoc(
//       doc(db, "stores", storeId, "sizes", sizeId)
//     )
//   ).data() as Size;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CreateSizeForm />
      </div>
    </div>
  );
};

export default CreateSizePage;
