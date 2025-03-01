
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";
import { getStoreById } from "@/actions/storeActions";

interface SettingPageProps {
    params : Promise<{
        storeId : string
    }>
}

const SettingsPage = async ({params}:SettingPageProps) => {
    const {storeId} = await params;
    const { userId } = await auth()

    if(!userId){
        redirect("/sign-in")
    }

    // const store = (await getDoc(doc(db, "stores", storeId))).data() as Store
    const store = await getStoreById(storeId)

    if(!store || store.userId !== userId){
        redirect("/")
    }

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-5 p-8 pt-6">
                <SettingsForm initialData={store} />
            </div>
        </div>
     );
}
 
export default SettingsPage;