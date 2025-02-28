import { Timestamp } from "firebase/firestore";

export interface Product{
    id: string;
    name: string;
    price: number;
    qty?: number;
    images: {url : string}[];
    isFeatured:boolean;
    isArchived: boolean;
    category: string;
    size: string;
    kitchen: string;
    cuisine: string;
    createdAt? : Timestamp;
    updateAt? : Timestamp;
}