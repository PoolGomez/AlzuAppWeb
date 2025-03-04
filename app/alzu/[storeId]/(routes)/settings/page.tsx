import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";
import { getStoreById } from "@/actions/storeActions";
import { auth } from "@/auth";

interface SettingPageProps {
    params : Promise<{
        storeId : string
    }>
}

const SettingsPage = async ({params}:SettingPageProps) => {
    const {storeId} = await params;
    const session = await auth()
    if(!session){
        redirect("/login")
    }
    // const store = (await getDoc(doc(db, "stores", storeId))).data() as Store
    const store = await getStoreById(storeId)

    if(!store || store.userId !== session.user.email){
        redirect("/alzu")
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