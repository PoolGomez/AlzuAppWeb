import { db } from "@/lib/firebase";
import { Billboards } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { BillboardForm } from "./components/billboard-form";

// interface BillboardPageProps{
//     params : Promise<{ 
//         storeId : string,
//         billboardId: string
//     }>
// }

const BillboardPage = async (
    {
        params,
    }:{
        params: Promise<{storeId: string, billboardId: string}>
    }
    ) => {
        // const {storeId,billboardId } = await params;
        const storeId = (await params).storeId;
        const billboardId = (await params).billboardId;
        console.log("billboardId: ",billboardId)
        const billboard = (await getDoc(doc(db,"stores", storeId, "billboards", billboardId ))).data() as Billboards;
        console.log("billboard: ",billboard)
        
        const parseBillboardData = (data:Billboards) => {
            
            return {
                id: data.id,
                label : data.label,
                imageUrl : data.imageUrl,
                }
            
          }


    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData = {parseBillboardData(billboard)} />
            </div>
           
        </div>
     );
}
 
export default BillboardPage;