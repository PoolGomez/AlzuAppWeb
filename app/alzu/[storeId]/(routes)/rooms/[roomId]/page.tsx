import { db } from "@/lib/firebase";
import { Room } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { RoomForm } from "./components/room-form";

const RoomPage = async ({
  params,
}: {
  params: Promise<{
    storeId: string,
    roomId: string
  }>
}) => {
  const {storeId, roomId} = await params;
  const room = (
    await getDoc(
      doc(db, "stores", storeId, "rooms", roomId)
    )
  ).data() as Room;

  const parseRoomData = (data:Room) => {
    return {
      id: data.id,
      name:data.name,
    }
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RoomForm initialData={parseRoomData(room)} />
      </div>
    </div>
  );
};

export default RoomPage;
