import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";

interface DashboardOverviewProps{
    params : { storeId : string }
}

const DashboardOverview = async ({params}: DashboardOverviewProps) => {
    const { storeId } = await params;
    const store = (
        await getDoc(doc(db, "stores", storeId))
    ).data() as Store;
    return (
        <div>Overview: {store.name}</div>
    )
}

export default DashboardOverview;