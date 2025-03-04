"use client"
import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

const SetupPage = () => {
    const onOpen = useStoreModal((state) => state.onOpen)
    const isOpen = useStoreModal((state) => state.isOpen)

    useEffect(()=>{
        if(!isOpen){
            onOpen();
        }
    },[isOpen, onOpen])
    return null
    // (
    // <div>
    //     Store modal
    //     <Modal 
    //         title="create your store" 
    //         description="This is the store modal" 
    //         isOpen 
    //         onClose={()=>{}}
    //     >
    //         This is the modal    
    //     </Modal>
    //     This is the dashboard
    //     <UserButton />
    // </div>
    // )
}
 
export default SetupPage;