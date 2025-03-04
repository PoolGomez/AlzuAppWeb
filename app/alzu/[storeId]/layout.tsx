import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import { Store } from "@/types-db"
import { SideBar } from "@/components/side-bar";
import { auth } from "@/auth";



interface DashboardLayout{
    children : React.ReactNode,
    params :Promise<{ storeId : string }>
}

const DashboardLayout = async ({children, params}: DashboardLayout) => {
    console.log("Dashboard Layout")
    const { storeId } = await params;
    const session = await auth();
    if(!session){
        redirect("/login")
    }
    const storeSnap = await getDocs(
        query(
            collection(db , "stores"),
            where("userId", "==" , session.user.email),
            where("id","==", storeId)
        )
    )

    let store : Store | undefined;
    storeSnap.forEach(doc => {
        store = doc.data() as Store
    })

    if(!store){
        redirect("/alzu")
    }

    return (
        <>
        {/* <Navbar /> */}
        <SideBar>
        {children}    
        </SideBar>
        {/* {children} */}
        </>
    )
}

export default DashboardLayout;