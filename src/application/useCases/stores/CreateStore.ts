import { Store } from "@/src/domain/entities/Store";
import { StoreRepository } from "@/src/domain/repositories/StoreRepository";

export class CreateStore {
    constructor(private storeRepository: StoreRepository) {}
  
    async execute(name : string):Promise<Store> {
      return this.storeRepository.createStore(name);
    }
}