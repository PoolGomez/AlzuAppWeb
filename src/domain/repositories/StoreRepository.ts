import { Store } from "../entities/Store";

export interface StoreRepository {
    // getStoreById(storeId: string): Promise<Store>;
    getStoresByUserId(userId: string): Promise<Store[]>;
    createStore(name:string):Promise<Store>;
    // getStoresByName(name: string): Promise<Store[]>;
  }