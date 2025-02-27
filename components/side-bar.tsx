import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarProvider, SidebarRail, SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { ToggleTheme } from "./toggle-theme";
import { StoreSwitcher } from "./store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import { SideNav } from "./side-nav";
import { UserButton } from "@clerk/nextjs";

export const SideBar = async(
    {children}:{children: React.ReactNode}
) => {
    
    const {userId} = await auth();

    if(!userId){
        redirect("/sign-in")
    }

    const storeSnap = await getDocs(
        query(collection(db, "stores"), where("userId", "==", userId))
    )

    const stores = [] as Store[];


    storeSnap.forEach(doc => {
        const dat = doc.data()
        stores.push({
            id: dat.id,
            name: dat.name,
            userId: dat.userId,
            // createdAt: dat.createdAt,
            // updateAt: dat.updateAt,
        }
            // doc.data() as Store
            
        );
    })

    return ( 
        <SidebarProvider>
        <Sidebar collapsible="icon" className="pt-12">
          {/* <SidebarHeader> */}

            {/* <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <GalleryVerticalEnd className="size-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {companySelected.name}
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
                    <Link href="/alzu">
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
                        </Link>
                        
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu> */}


            {/* <StoreSwitcher items={stores} /> */}

          {/* </SidebarHeader> */}

          <SidebarContent>
          
            <SidebarGroup>
              <SidebarGroupLabel>Modules</SidebarGroupLabel>
              
             <SideNav />

            </SidebarGroup>
           
          </SidebarContent>
          {/* <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={data.user.avatar}
                          alt={data.user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          
                          {userName}
                        </span>
                        <span className="truncate text-xs">
                          
                          {userEmail}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={data.user.avatar}
                            alt={data.user.name}
                          />
                          <AvatarFallback className="rounded-lg">
                            CN
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            
                            {userName}
                          </span>
                          <span className="truncate text-xs">
                            
                            {userEmail}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Sparkles />
                        Actualizar a Pro
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <BadgeCheck />
                        Información
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem>
                        <Bell />
                        Notificaciones
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleClickLogout}>
                      <LogOut />
                      Cerrar sesión
                    </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter> */}
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header 
            // className="fixed flex h-16 shrink-0 items-center justify-between  gap-2 pr-2 gap-x-4 md:pr-6 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
            className="fixed top-0 left-0 w-full z-50 flex h-12 shrink-0 items-center justify-between gap-2 pr-2 gap-x-4 md:pr-6 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-background"
          >
            <div 
            
              className="flex items-center gap-2 px-4"
            >
              <SidebarTrigger
              className="p-2" 
              />
              <Separator orientation="vertical" className="mr-2 h-8" />
              <StoreSwitcher items={stores} />
            </div>
            <div className="flex gap-x-2 items-center">
              <ToggleTheme />
              <UserButton />
            </div>
          </header>
          <main className="pt-12">
            {children}
          </main>
          
         
        </SidebarInset>
      </SidebarProvider>
     );
}