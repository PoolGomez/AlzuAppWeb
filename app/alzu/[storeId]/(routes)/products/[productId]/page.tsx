import { db } from "@/lib/firebase";
import { Category, Cuisine, Kitchen, Product, Size } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { ProductForm } from "./components/product-form";
import { redirect } from "next/navigation";

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

  if (!product) {
      redirect(`/alzu/${storeId}/products`);
  }
  const parseProductData = (data:Product) => {
    return {
      id: data.id,
      value: data.value,
      name: data.name,
      price: data.price,
      qty: data.qty,
      images: data.images,
      isFeatured: data.isFeatured,
      isArchived: data.isArchived,
      category: data.category,
      size: data.size,
      kitchen: data.kitchen,
      cuisine: data.cuisine
    }
}

  const categoriesData = (
    await getDocs(collection(doc(db,"stores", storeId), "categories"))
  ).docs.map(doc => doc.data()) as Category[]
  const formattedCategories : Category[] = categoriesData.map(item => ({
    id: item.id,
    name: item.name,
    billboardId: item.billboardId,
    billboardLabel: item.billboardLabel
  }))

  const sizesData = (
    await getDocs(collection(doc(db,"stores", storeId), "sizes"))
  ).docs.map(doc => doc.data()) as Size[]
  const formattedSizes : Size[] = sizesData.map(item => ({
    id: item.id,
    name: item.name,
    value: item.value,
  }))

  const kitchensData = (
    await getDocs(collection(doc(db,"stores", storeId), "kitchens"))
  ).docs.map(doc => doc.data()) as Kitchen[]
  const formattedKitchens : Kitchen[] = kitchensData.map(item => ({
    id: item.id,
    name: item.name,
    value: item.value,
  }))

  const cuisinesData = (
    await getDocs(collection(doc(db,"stores", storeId), "cuisines"))
  ).docs.map(doc => doc.data()) as Cuisine[]
  const formattedCuisines : Cuisine[] = cuisinesData.map(item => ({
    id: item.id,
    name: item.name,
    value: item.value,
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          initialData={parseProductData(product)} 
          categories={formattedCategories}
          kitchens={formattedKitchens}
          cuisines={formattedCuisines}
          sizes={formattedSizes}
        />
      </div>
    </div>
  );
};

export default ProductPage;
