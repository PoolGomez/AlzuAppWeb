import { Timestamp } from "firebase/firestore";

export interface Billboard{
    id: string;
    label : string;
    imageUrl : string;
    createdAt? : Timestamp;
    updateAt? : Timestamp;
}