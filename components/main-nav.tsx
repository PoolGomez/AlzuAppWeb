"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

export const MainNav = (
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
        },
        {
            href : `/${params.storeId}/billboards`,
            label :"Billboards",
            active : pathname === `/${params.storeId}/billboards`,
        },
        {
            href : `/alzu/${params.storeId}/categories`,
            label :"Categories",
            active : pathname === `/${params.storeId}/categories`,
        },
        {
            href : `/alzu/${params.storeId}/sizes`,
            label :"Sizes",
            active : pathname === `/${params.storeId}/sizes`,
        },
        {
            href : `/alzu/${params.storeId}/kitchens`,
            label :"Kitchens",
            active : pathname === `/${params.storeId}/kitchens`,
        },
        {
            href : `/alzu/${params.storeId}/cuisines`,
            label :"Cuisines",
            active : pathname === `/${params.storeId}/cuisines`,
        },
        {
            href : `/alzu/${params.storeId}/products`,
            label :"Products",
            active : pathname === `/${params.storeId}/products`,
        },
        {
            href : `/alzu/${params.storeId}/orders`,
            label :"Orders",
            active : pathname === `/${params.storeId}/orders`,
        },
        {
            href : `/alzu/${params.storeId}/settings`,
            label :"Settings",
            active : pathname === `/${params.storeId}/settings`,
        },
    ]
    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6 pl-6")}>
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
        </nav>
    )
}