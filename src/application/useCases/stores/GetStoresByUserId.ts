import { Store } from "@/src/domain/entities/Store";
import { StoreRepository } from "@/src/domain/repositories/StoreRepository";

export class GetStoresByUserId {
    constructor(private storeRepository: StoreRepository) {}
  
    async execute(userId: string): Promise<Store[]> {
      return this.storeRepository.getStoresByUserId(userId);
    }
  }