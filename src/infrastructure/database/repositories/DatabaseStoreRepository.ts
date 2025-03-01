import { Store } from "@/src/domain/entities/Store";
import { StoreRepository } from "@/src/domain/repositories/StoreRepository";
import { db } from "@/src/infrastructure/database/config/database";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { StoreMapper } from "../mappers/StoreMapper";
import axios from "axios";

export class DatabaseStoreRepository implements StoreRepository {
  async update(storeId: string, store: {name:string}): Promise<void> {
    try {
    //   const updateStore = 
    //   await axios.patch(`${process.env.NEXT_URL_API}/api/${storeId}`, {
    //     name: store.name
    //   });
    //   console.log("updateStore: ",updateStore);
    // return StoreMapper.toDomain(updateStore);

        const docRef = doc(db, "stores", storeId)
        await updateDoc(docRef, store)

    } catch (error) {
        console.log(error)
      throw new Error("Error DatabaseStoreRepository update...");
    }
  }
  async delete(storeId: string): Promise<void> {
    try {
      await axios.delete(`${process.env.NEXT_URL_API}/api/${storeId}`);
    } catch (error) {
      console.log(error);
      throw new Error("Error DatabaseStoreRepository delete...");
    }
  }
  // async getAll(): Promise<Store[]> {
  //     throw new Error("Method not implemented.");
  // }
  async getById(storeId: string): Promise<Store | null> {
    try {
      const storeSnap = (
        await getDoc(doc(db, "stores", storeId))
      ).data() as Store;
      return StoreMapper.toDomain(storeSnap);
    } catch (error) {
      console.log(error);
      throw new Error("Error DatabaseStoreRepository getById...");
    }
  }

  async create(name: string): Promise<Store> {
    try {
      const storeRef = await axios.post("/api/stores", { name });
      return StoreMapper.toDomain(storeRef.data);
    } catch (error) {
      console.log(error);
      throw new Error("Error DatabaseStoreRepository create...");
    }
  }
  async getByUserId(userId: string): Promise<Store[]> {
    try {
      const stores = [] as Store[];

      const storeSnap = await getDocs(
        query(collection(db, "stores"), where("userId", "==", userId))
      );
      storeSnap.forEach((item) => {
        const dat = item.data();
        stores.push(
          {
            id: dat.id,
            name: dat.name,
            userId: dat.userId,
            // createdAt: dat.createdAt,
            // updateAt: dat.updateAt,
          }
          // doc.data() as Store
        );
      });

      return StoreMapper.toDomainArray(stores);
    } catch (error) {
      console.log(error);
      throw new Error("Error DatabaseStoreRepository getByUserId...");
    }
  }
}
