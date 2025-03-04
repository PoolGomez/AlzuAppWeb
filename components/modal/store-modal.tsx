"use client"
import { useStoreModal } from "@/hooks/use-store-modal"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"


import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import toast from "react-hot-toast"
import { Modal } from "@/components/modal"
import { DatabaseStoreRepository } from "@/src/infrastructure/database/repositories/DatabaseStoreRepository"
import { CreateStore } from "@/src/application/useCases/stores/CreateStore"

const formSchema = z.object({
    name : z
        .string()
        .min(3, {message : "Store name should be minimum 3 characters"})
})


export const StoreModal = () => {
    const storeRepo = new DatabaseStoreRepository();
    const useCase = new CreateStore(storeRepo);


    const storeModal = useStoreModal();

    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)

            // const response = await axios.post("/api/stores", values);         
             const newStore = await useCase.execute(values.name);

            toast.success("Store Created")
            // window.location.assign(`/${response.data.id}`)
            window.location.assign(`/alzu/${newStore.id}`)
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }finally{
            setIsLoading(false)
        }   
    }

    return (
        <Modal
            title="Create a new Store"
            description="Add a new store to manage the products and categories"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button disabled={isLoading} type="button"  variant={"outline"} size={"sm"} onClick={storeModal.onClose}>Cancel</Button>
                                <Button disabled={isLoading} type="submit" size={"sm"}>Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}