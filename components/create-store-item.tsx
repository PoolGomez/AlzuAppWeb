"use client"

import { PlusCircle } from "lucide-react"

interface CreateNewStoreItemProps{
    onClick : () => void
}
export const CreateNewStoreItem = ({onClick}: CreateNewStoreItemProps) => {
    return (
        <div 
            onClick={onClick} 
            className="flex items-center bg-gray-50 px-2 py-2 cursor-pointer text-muted-foreground hover:text-primary"
        >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="text-sm"> Create Store</span>
        </div>
    )
}