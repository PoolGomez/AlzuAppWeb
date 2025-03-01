import { Store } from "@/src/domain/entities/Store";
import { StoreRepository } from "@/src/domain/repositories/StoreRepository";

export class GetStoreById {
    constructor(private storeRepository: StoreRepository) {}
  
    async execute(userId: string): Promise<Store | null> {
      return this.storeRepository.getById(userId);
    }
  }