import { Timestamp } from "firebase/firestore";

export interface Size {
    id: string;
    name: string;
    value: string;
    createdAt? : Timestamp;
    updateAt? : Timestamp;
}