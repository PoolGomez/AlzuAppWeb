"use client"

import { useParams, useRouter } from "next/navigation"
import { CuisineColumns } from "./columns"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreVertical, Trash } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"
import { AlertModal } from "@/components/modal/alert-modal"

interface CellActionProps{
    data: CuisineColumns
}
export const CellAction = ({data}:CellActionProps) => {

    const router = useRouter();
    const params = useParams();

    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Cuisine id copied to clipboard")
    };

    const onDelete = async () => {
        try {
          setIsLoading(true);
    
          await axios.delete(
            `/api/${params.storeId}/cuisines/${data.id}`
          );
    
          toast.success("Cuisine Removed");
          location.reload()
          router.push(`/alzu/${params.storeId}/cuisines`);
        } catch (error) {
            console.log(error);
          toast.error("Something went wrong");
        } finally {
          setIsLoading(false);
          setOpen(false);
        }
    };


    return (
        <>
        <AlertModal
            isOpen={open}
            onClose={()=>setOpen(false)}
            onConfirm={onDelete}
            loading={isLoading}
        />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8 p-0" variant={"ghost"}>
                    <span className="sr-only">Open</span>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem onClick={()=>onCopy(data.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Id
                </DropdownMenuItem>

                <DropdownMenuItem onClick={()=> router.push(`/alzu/${params.storeId}/cuisines/${data.id}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Update
                </DropdownMenuItem>

                <DropdownMenuItem onClick={()=> setOpen(true)}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}