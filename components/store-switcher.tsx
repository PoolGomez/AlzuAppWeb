"use client";
import { useState } from "react";
import { PopoverTrigger } from "./ui/popover";
import { Store } from "@/types-db";
import { ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { StoreListItem } from "./store-list-item";
import { useStoreModal } from "@/hooks/use-store-modal";
import { CreateNewStoreItem } from "./create-store-item";
import { SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export function StoreSwitcher({ items }: StoreSwitcherProps) {
  const params = useParams();
  const router = useRouter();
  const storeModal = useStoreModal();

  const formattedStores = items?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedStores?.find(
    (item) => item.value === params.storeId
  );

  const [open, setOpen] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [filtered, setFiltered] = useState<{ label: string; value: string }[]>(
  //   []
  // );

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  // const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value);
  //   setFiltered(
  //     formattedStores?.filter((item) =>
  //       item.label.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   );
  // };

  return (
    <SidebarMenu>
        <SidebarMenuItem>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton tooltip={currentStore?.label}  size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                            {currentStore?.value
                                ? formattedStores?.find(
                                    (framework) => framework.value === currentStore.value
                                )?.label
                                : "Select Store..."
                            }
                            </span>
                        </div>
                      <ChevronsUpDown className="ml-auto" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    align="start"
                    side="bottom"
                    sideOffset={4}
                  >

                    <SidebarGroupLabel>Stores</SidebarGroupLabel>
                    {/* <div className="w-full px-2 py-1 flex items-center border rounded-md border-gray-100">
                        <StoreIcon className="mr-2 h-4 w-4 min-w-4" />
                        <input
                        type="text"
                        placeholder="Search Store..."
                        onChange={handleSearchTerm}
                        className="flex-1 w-full outline-none"
                        />
                    </div> */}
                    {formattedStores?.map((item, index) => (
                        <StoreListItem
                            store={item}
                            key={`${index}-${item.value}`}
                            onSelect={onStoreSelect}
                            isChecked={currentStore?.value === item.value}
                        />
                        ))}


                    {/* <Link href="/alzu">
                      <DropdownMenuItem className="gap-2 p-2 ">
                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                          <Building2 className="size-4" />
                        </div>
                        <div className="font-medium text-muted-foreground">
                          Ver todas las empresas
                        </div>
                      </DropdownMenuItem>
                    </Link>
                      
                      
                    <Link href="/alzu/create">
                        <DropdownMenuItem className="gap-2 p-2">
                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                            <Plus className="size-4" />
                        </div>
                        <div className="font-medium text-muted-foreground">
                            Crear una empresa
                        </div>
                        </DropdownMenuItem>
                    </Link> */}

                    <Separator />

                <CreateNewStoreItem
                  onClick={() => {
                    setOpen(false);
                    storeModal.onOpen();
                  }}
                />

                        
                  </DropdownMenuContent>

            </DropdownMenu>
        </SidebarMenuItem>
    </SidebarMenu>
  );
}



{/* <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.value
            ? formattedStores?.find(
                (framework) => framework.value === currentStore.value
              )?.label
            : "Select Store..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <div className="w-full px-2 py-1 flex items-center border rounded-md border-gray-100">
            <StoreIcon className="mr-2 h-4 w-4 min-w-4" />
            <input
              type="text"
              placeholder="Search Store..."
              onChange={handleSearchTerm}
              className="flex-1 w-full outline-none"
            />
          </div>
          <CommandList>
            <CommandGroup heading="Stores">
              {searchTerm === "" ? (
                formattedStores?.map((item, index) => (
                  <StoreListItem
                    store={item}
                    key={index}
                    onSelect={onStoreSelect}
                    isChecked={currentStore?.value === item.value}
                  />
                ))
              ) : filtered?.length > 0 ? (
                filtered?.map((item, index) => (
                  <StoreListItem
                    store={item}
                    key={index}
                    onSelect={onStoreSelect}
                    isChecked={currentStore?.value === item.value}
                  />
                ))
              ) : (
                <CommandEmpty>No Store Found</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CreateNewStoreItem
                onClick={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover> */}