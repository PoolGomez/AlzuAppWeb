import { Store } from "@/src/domain/entities/Store";
import { StoreRepository } from "@/src/domain/repositories/StoreRepository";

export class UpdateStore {
    constructor(private storeRepository: StoreRepository) {}
      
    async execute(storeId : string, store:{name:string}):Promise<void> {
      if(!storeId){
        throw new Error("store id is required")
      }
      this.storeRepository.update(storeId,store);
    }
}