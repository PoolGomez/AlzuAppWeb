import { db } from "@/lib/firebase";
import { Category, Cuisine, Kitchen, Product, Size } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params,
}: {
  params: Promise<{
    storeId: string,
    productId: string
  }>
}) => {
  const {storeId, productId} =await params;
  const product = (
    await getDoc(
      doc(db, "stores", storeId, "products", productId)
    )
  ).data() as Product;

  const categoriesData = (
    await getDocs(collection(doc(db,"stores", storeId), "categories"))
  ).docs.map(doc => doc.data()) as Category[]

  const sizesData = (
    await getDocs(collection(doc(db,"stores", storeId), "sizes"))
  ).docs.map(doc => doc.data()) as Size[]

  const kitchensData = (
    await getDocs(collection(doc(db,"stores", storeId), "kitchens"))
  ).docs.map(doc => doc.data()) as Kitchen[]

  const cuisinesData = (
    await getDocs(collection(doc(db,"stores", storeId), "cuisines"))
  ).docs.map(doc => doc.data()) as Cuisine[]

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          initialData={product} 
          categories={categoriesData}
          kitchens={kitchensData}
          cuisines={cuisinesData}
          sizes={sizesData}
        />
      </div>
    </div>
  );
};

export default ProductPage;
