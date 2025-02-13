import { Timestamp } from "firebase/firestore";

export interface Store {
    id : string;
    name : string;
    userId : string;
    // createdAt? : Timestamp;
    // updateAt? : Timestamp;
}

export interface Billboards{
    id: string,
    label : string,
    imageUrl : string,
    createdAt? : Timestamp;
    updateAt? : Timestamp;
}