import { Timestamp } from "firebase/firestore";

export interface Kitchen {
    id: string;
    name: string;
    value: string;
    createdAt? : Timestamp;
    updateAt? : Timestamp;
}