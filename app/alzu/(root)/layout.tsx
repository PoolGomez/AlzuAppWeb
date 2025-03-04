import { auth } from "@/auth";
import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";

interface SetupLayoutProp {
    children: React.ReactNode
}

const SetupLayout = async ({children}:SetupLayoutProp) => {
    console.log("Setup Layout")
    const session = await auth()
    console.log("session: ", session)
    if(!session){
        redirect("/login")
    }

    const storeSnap = await getDocs(
        query(collection(db,"stores"), where("userId","==", session.user.email))
    )

    let store : Store | undefined;

    storeSnap.forEach(doc=>{
        store = doc.data() as Store;
        console.log("store for: ", store)
        return
    })

    if(store){
        redirect(`/alzu/${store?.id}`)
        // redirect("/alzu/sUPXLBuKnvxgZTLwgOMk")
    }

    return (
        <div>
            {children}
        </div>
    );
}
 
export default SetupLayout;