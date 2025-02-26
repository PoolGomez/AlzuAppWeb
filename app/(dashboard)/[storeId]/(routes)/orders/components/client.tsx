"use client"

import { Heading } from "@/components/heading"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"
// import { useParams, useRouter } from "next/navigation"
import { columns, OrderColumns } from "./columns"



interface OrderClientProps{
    data: OrderColumns[]
}

export const OrderClient = ({data}: OrderClientProps) => {

    // const params = useParams()
    // const router = useRouter()

    return (
        <>
        <div className="flex items-center justify-between">
            <Heading 
                title={`Orders (${data.length})`} 
                description="Manage order for your store"
            />
            {/* <Button onClick={()=>router.push(`/${params.storeId}/ordesr/create`)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New
            </Button> */}
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={data}/>

        {/* <Heading title="API" description="API calls for order" />
        <Separator />
        <ApiList entityName="orders" entityNameId="orderId" /> */}
        </>
    )
}