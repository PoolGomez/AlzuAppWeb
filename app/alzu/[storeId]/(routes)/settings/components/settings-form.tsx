"use client"

import { deleteStoreAction, updateStoreAction } from "@/actions/storeActions"
import { ApiAlert } from "@/components/api-alert"
import { Heading } from "@/components/heading"
import { AlertModal } from "@/components/modal/alert-modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useOrigin } from "@/hooks/use-origin"
import { Store } from "@/types-db"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface SettingsFormProps {
    initialData : Store
}

const formSchema = z.object({
    name : z
        .string()
        .min(3, {message : "Store name should be minimum 3 characters"})
})

export const SettingsForm = ({initialData}: SettingsFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: initialData
    })

    const [ isLoading, setIsLoading ] = useState(false)
    const [open, setOpen] = useState(false)
    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            // await axios.patch(`/api/${params.storeId}`, {name: data.name});
            
            await updateStoreAction(
                `${params.storeId}`,
                // "MDq4XHczWL7Ovx8RufeV",
                // {
                //     name: data.name
                // }
                data
            )
            toast.success("Store Updated")
            router.refresh();
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }finally{
            setIsLoading(false)
        }   
    }

    const onDelete = async()=>{
        try {
            setIsLoading(true)
            console.log("Store ID:", params.storeId);
            await axios.delete(`/api/${params.storeId}`);
            // await deleteStoreAction(`${params.storeId}`)
            toast.success("Store Removed")
            router.refresh();
            router.push("/alzu")
        } catch (error) {
            console.log("Error deleting store:", error)
            toast.error("Something went wrong")
        }finally{
            setIsLoading(false)
            setOpen(false)
        } 
    }


  return (
   <>
    <AlertModal 
        isOpen={open}
        onClose={()=> setOpen(false)}   
        onConfirm={onDelete}
        loading={isLoading}
    />
    <div className="flex items-center justify-center">
        <Heading title="Settings" description="Manage Store Preferences" />
        <Button variant={"destructive"} size={"icon"} onClick={()=>{setOpen(true)}} >
            <Trash className="h-4 w-4" />
        </Button>
    </div>
    <Separator />
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
            <div className="grid grid-cols-3 gap-8">
                <FormField 
                    control={form.control} 
                    name="name"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    placeholder="Your store name..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
                <Button disabled={isLoading} type="submit" size={"sm"}>Save Changes</Button>
            
        </form>
    </Form>
    <Separator />
    <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
    />
   </>
  )
}