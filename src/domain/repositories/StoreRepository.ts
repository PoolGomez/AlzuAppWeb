import { Store } from "@/src/domain/entities/Store";

export interface StoreRepository {
    // getStoreById(storeId: string): Promise<Store>;
    



    create(name:string):Promise<Store>;
    // update(storeId: string, store: Partial<Store>):Promise<void>;
    update(storeId: string, store: {name:string}):Promise<void>;
    delete(id: string):Promise<void>;
    // getAll(): Promise<Store[]>;
    getById(storeId: string):Promise<Store | null>;
    getByUserId(userId: string): Promise<Store[]>;





    // getStoresByName(name: string): Promise<Store[]>;
  }