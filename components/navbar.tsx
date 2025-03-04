import { StoreSwitcher } from "@/components/store-switcher";
import { redirect } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import { MainNav } from "./main-nav";
import { auth } from "@/auth";

export const Navbar = async () => {

    const session = await auth();

    if(!session){
        redirect("/login")
    }

    const storeSnap = await getDocs(
        query(collection(db, "stores"), where("userId", "==", session.user.email))
    )

    const stores = [] as Store[];


    storeSnap.forEach(doc => {
        const dat = doc.data()
        stores.push({
            id: dat.id,
            name: dat.name,
            userId: dat.userId,
            // createdAt: dat.createdAt,
            // updateAt: dat.updateAt,
        }
            // doc.data() as Store
            
        );
    })

    return ( 
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={stores} />

                {/* routes */}
                <MainNav />

                {/* userprofile */}
                <div className="ml-auto">
                    {session.user.email}
                    {/* <UserButton afterSwitchSessionUrl="/" /> */}
                </div>
            </div>
        </div>
     );
}
 
