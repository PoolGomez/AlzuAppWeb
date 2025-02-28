import { Timestamp } from "firebase/firestore";

export interface Cuisine {
    id: string;
    name: string;
    value: string;
    createdAt? : Timestamp;
    updateAt? : Timestamp;
}