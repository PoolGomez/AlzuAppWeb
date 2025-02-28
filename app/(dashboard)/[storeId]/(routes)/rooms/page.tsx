import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Room } from "@/types-db";
import { format } from "date-fns"
import { RoomColumns } from "./components/columns";
import { RoomClient } from "./components/client";


const RoomsPage = async ({params}:{params:Promise<{storeId: string}>}) => {
    const {storeId}= await params;
    const roomsData = (
        await getDocs(
            collection(doc(db, "stores", storeId), "rooms")
        )
    ).docs.map(doc => 
        // ({
        doc.data()
    //     id: doc.id,
    //     name: doc.data().name,
    // }) 
    ) as Room[];

    const formattedSizes : RoomColumns[] = roomsData.map(item => ({
        id: item.id,
        name: item.name,
        createdAt:  item.createdAt 
            ? format(item.createdAt.toDate(),"MMMM do, yyyy") 
            : "",
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <RoomClient data={formattedSizes}/>
            </div>
            
        </div>
    )
}

export default RoomsPage;