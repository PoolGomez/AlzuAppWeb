import { StoreRepository } from "@/src/domain/repositories/StoreRepository";

export class DeleteStore {
    constructor(private storeRepository: StoreRepository) {}
      
    async execute(storeId : string):Promise<void> {
      if(!storeId){
        throw new Error("id is required")
      }
      console.log("execute: ", storeId);
      this.storeRepository.delete(storeId);
    }
}