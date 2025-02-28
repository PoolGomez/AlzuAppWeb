// import { Store, StoreRepository } from "domain/repositories/StoreRepository";
import { Store } from "@/src/domain/entities/Store";
import { StoreRepository } from "@/src/domain/repositories/StoreRepository";
import { db } from "@/src/infrastructure/database/config/database";
import { collection, getDocs, query, where} from "firebase/firestore"
import { StoreMapper } from "../mappers/StoreMapper";
import axios from "axios";

export class DatabaseStoreRepository implements StoreRepository {
    
    async createStore(name: string): Promise<Store> {
        try {
            const storeRef = await axios.post("/api/stores", {name});
            return StoreMapper.toDomain(storeRef.data)    
        } catch (error) {
            throw new Error("Errot DatabaseStoreRepository CreateStore...");    
        }
    }
    async getStoresByUserId(userId: string): Promise<Store[]> {

        const stores = [] as Store[];

        const storeSnap = await getDocs(
            query(collection(db, "stores"), where("userId", "==", userId))
        );
        storeSnap.forEach((item) => {
            const dat = item.data()
            stores.push({
                id: dat.id,
                name: dat.name,
                userId: dat.userId,
                // createdAt: dat.createdAt,
                // updateAt: dat.updateAt,
            }
                // doc.data() as Store
                
            );
        })

        return StoreMapper.toDomainArray(stores)

        // throw new Error("Method not implemented.");
    }
//   async getStoreById(storeId: string): Promise<Store> {
//     const doc = await db.collection("stores").doc(storeId).get();
//     return StoreMapper.toDomain(doc.data());
//   }
}

