import { Store } from "@/src/domain/entities/Store";

export class StoreMapper {
    static toDomain(data: any): Store {
      return {
        id: data.id,
        name: data.name,
        userId: data.userId,
      };
    }
    static toDomainArray(data: any[]): Store[]{
        return data.map(data => this.toDomain(data))
    }
}
