import { Timestamp } from "firebase/firestore";

export interface Category {
    id: string;
    billboardId: string;
    billboardLabel: string;
    name : string;
    createdAt? : Timestamp;
    updateAt? : Timestamp;
}