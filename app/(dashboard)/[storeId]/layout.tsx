import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import { Store } from "@/types-db"
import { Navbar } from "@/components/navbar";



interface DashboardLayout{
    children : React.ReactNode,
    params : { storeId : string }
}

const DashboardLayout = async ({children, params}: DashboardLayout) => {
    const { storeId } = await params;
    const { userId } = await auth()
    if(!userId){
        redirect("/sign-in")
    }
    const storeSnap = await getDocs(
        query(
            collection(db , "stores"),
            where("userId", "==" , userId),
            where("id","==", storeId)
        )
    )

    let store : Store | undefined;

    storeSnap.forEach(doc => {
        store = doc.data() as Store
    })

    if(!store){
        redirect("/")
    }

    return (
        <>
        <Navbar />
        {/* {params.storeId} */}
        {children}
        </>
    )
}

export default DashboardLayout;