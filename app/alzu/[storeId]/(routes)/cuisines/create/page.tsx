import { CreateCuisineForm } from "./components/create-cuisine-form";

const CreateCuisinePage = async () => {

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CreateCuisineForm />
      </div>
    </div>
  );
};

export default CreateCuisinePage;
