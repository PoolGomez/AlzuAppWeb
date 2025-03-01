"use server"

import { CreateStore } from "@/src/application/useCases/stores/CreateStore";
import { DeleteStore } from "@/src/application/useCases/stores/DeleteStore";
import { GetStoreById } from "@/src/application/useCases/stores/GetStoreById";
import { GetStoresByUserId } from "@/src/application/useCases/stores/GetStoresByUserId";
import { UpdateStore } from "@/src/application/useCases/stores/UpdateStore";
import { Store } from "@/src/domain/entities/Store";
import { DatabaseStoreRepository } from "@/src/infrastructure/database/repositories/DatabaseStoreRepository";

export async function deleteStoreAction(storeId: string){
    const storeRepo = new DatabaseStoreRepository();
    const deleteStore = new DeleteStore(storeRepo);
    await deleteStore.execute(storeId);
}
export async function createStoreAction(name: string){
    const storeRepo = new DatabaseStoreRepository();
    const createStore = new CreateStore(storeRepo);
    await createStore.execute(name)
}
export async function getStoresByUserId(userId: string):Promise<Store[]>{
    const storeRepo = new DatabaseStoreRepository();
    const getStores= new GetStoresByUserId(storeRepo);
    return await getStores.execute(userId);
}
export async function updateStoreAction(storeId: string, store: {name:string}):Promise<void>{
    const storeRepo = new DatabaseStoreRepository();
    const updateStore = new UpdateStore(storeRepo);
    await updateStore.execute(storeId, store);
}
export async function getStoreById(storeId: string): Promise<Store | null>{
    const storeRepo = new DatabaseStoreRepository();
    const getStoreById= new GetStoreById(storeRepo);
    const result = await getStoreById.execute(storeId);
    if(result === null){
        return null
    }
    return await getStoreById.execute(storeId);
}
