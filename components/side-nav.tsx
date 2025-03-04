"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible"
import { Armchair, CheckCheck, FolderOpen, Grid, HandPlatter, LayoutDashboard, Ruler, Salad, Wrench } from "lucide-react"

export const SideNav = (
    // {
        // className,
        //  ...props
    // }: React.HtmlHTMLAttributes<HTMLElement>
) => {

    const pathname = usePathname()
    const params = useParams()

    const routes =[
        {
            href : `/alzu/${params.storeId}`,
            label :"Overview",
            active : pathname === `/${params.storeId}`,
            icon: LayoutDashboard
        },
        {
            href : `/alzu/${params.storeId}/billboards`,
            label :"Billboards",
            active : pathname === `/${params.storeId}/billboards`,
            icon: LayoutDashboard
        },
        {
            href : `/alzu/${params.storeId}/categories`,
            label :"Categories",
            active : pathname === `/${params.storeId}/categories`,
            icon: FolderOpen
        },
        {
            href : `/alzu/${params.storeId}/sizes`,
            label :"Sizes",
            active : pathname === `/${params.storeId}/sizes`,
            icon: Ruler
        },
        {
            href : `/alzu/${params.storeId}/kitchens`,
            label :"Kitchens",
            active : pathname === `/${params.storeId}/kitchens`,
            icon: HandPlatter
        },
        {
            href : `/alzu/${params.storeId}/cuisines`,
            label :"Cuisines",
            active : pathname === `/${params.storeId}/cuisines`,
            icon: HandPlatter
        },
        {
            href : `/alzu/${params.storeId}/products`,
            label :"Products",
            active : pathname === `/${params.storeId}/products`,
            icon: Salad
        },
        {
            href : `/alzu/${params.storeId}/orders`,
            label :"Orders",
            active : pathname === `/${params.storeId}/orders`,
            icon: HandPlatter
        },
        {
            href : `/alzu/${params.storeId}/settings`,
            label :"Settings",
            active : pathname === `/${params.storeId}/settings`,
            icon: Wrench
        },
        {
            href : `/alzu/${params.storeId}/rooms`,
            label :"Rooms",
            active : pathname === `/${params.storeId}/rooms`,
            icon: Grid
        },
        {
            href : `/alzu/${params.storeId}/tables`,
            label :"Tables",
            active : pathname === `/${params.storeId}/tables`,
            icon: Armchair
        },

    ]
    return (
        
        <SidebarMenu>
            {routes.map((route)=>(
                <Collapsible 
                    key={route.label}
                    asChild
                    defaultOpen={route.active}
                    className="group/collapsible"
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={route.label}>
                                
                                    <Link 
                                        href={route.href}
                                        className={cn(
                                            "text-sm font-medium transition-colors hover:text-primary w-full",
                                            route.active 
                                                ? "text-black dark:text-white" 
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center justify-start">
                                                {route.icon && <route.icon className="h-4 w-4" />}
                                                <p className="text-sm ml-4">{route.label}</p>
                                            </div>
                                            <div>
                                                {route.active && <CheckCheck className="w-4 h-4"/>}
                                            </div>
                                        </div>
                                    </Link>
                                
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                    </SidebarMenuItem>
                
                </Collapsible>
            ))}
        </SidebarMenu>


    )
}


{/* <nav className={cn("flex items-center space-x-4 lg:space-x-6 pl-6")}>
            {routes.map(route => (
                <Link 
                    key={route.href} 
                    href={route.href} 
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        route.active 
                            ? "text-black dark:text-white" 
                            : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav> */}