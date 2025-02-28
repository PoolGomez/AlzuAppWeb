"use client"

import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { columns, RoomColumns } from "./columns"
import ApiList from "@/components/api-list"


interface RoomClientProps{
    data: RoomColumns[]
}

export const RoomClient = ({data}: RoomClientProps) => {

    const params = useParams()
    const router = useRouter()

    return (
        <>
        <div className="flex items-center justify-between">
            <Heading 
                title={`Rooms (${data.length})`} 
                description="Manage rooms for your store"
            />
            <Button onClick={()=>router.push(`/${params.storeId}/rooms/create`)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New
            </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={data}/>

        <Heading title="API" description="API calls for rooms" />
        <Separator />
        <ApiList entityName="rooms" entityNameId="roomId" />
        </>
    )
}