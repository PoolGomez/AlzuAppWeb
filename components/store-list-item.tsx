"use client";

import { cn } from "@/lib/utils";
import { Check, Store } from "lucide-react";


interface StoreItem {
  label : string,
  value : string,
}

interface StoreListItemProps {
  store: StoreItem;
  onSelect: (store: StoreItem) => void;
  isChecked: boolean;
}

export const StoreListItem = ({
  store,
  onSelect,
  isChecked,
}: StoreListItemProps) => {
  return (
    <div
      className="flex items-center px-2 py-1 cursor-pointer hover: bg-grat-50 text-muted-foreground hover:text-primary"
      onClick={() => onSelect(store)}
    >
      <Store className="mr-2 h-4 w-4" />
      <p className="w-full truncate text-sm whitespace-nowrap">{store.label}</p>
      <Check
        className={cn(
          "ml-auto w-4 h-4",
          isChecked ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};
