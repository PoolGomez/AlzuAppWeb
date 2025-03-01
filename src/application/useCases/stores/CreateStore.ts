import { Store } from "@/src/domain/entities/Store";
import { StoreRepository } from "@/src/domain/repositories/StoreRepository";

export class CreateStore {
    constructor(private storeRepository: StoreRepository) {}
  
    
    async execute(name : string):Promise<Store> {
      if(!name){
        throw new Error("invalid store data")
      }
      return this.storeRepository.create(name);
    }
}