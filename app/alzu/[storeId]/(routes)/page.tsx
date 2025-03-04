import { getGraphTotalRevenue } from "@/actions/get-graph-total-revenue";
import { getTotalProducts } from "@/actions/get-total-products";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getOrderTotalRevenueByCategory } from "@/actions/get-total-revenue-by-category";
import { getOrderPaymentStatusTotalRevenue } from "@/actions/get-total-revenue-by-order-status";
import { getOrderStatusTotalRevenue } from "@/actions/get-total-revenue-order-status";
import { getTotalSales } from "@/actions/get-total-sales";
import { Heading } from "@/components/heading";
import Overview from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface DashboardOverviewProps{
    params : Promise<{ storeId : string }>
}

const DashboardOverview = async ({params}: DashboardOverviewProps) => {
    const { storeId } = await params;
    const totalRevenue = await getTotalRevenue(storeId);
    const totalSales = await getTotalSales(storeId);
    const totalProducts = await getTotalProducts(storeId);

    const monthlyGraphRevenue = await getGraphTotalRevenue(storeId);
    const revenueByOrderStatus = await getOrderStatusTotalRevenue(storeId);
    const revenueBycategory = await getOrderTotalRevenueByCategory(storeId);
    const orderStatusTotalRevenue = await getOrderPaymentStatusTotalRevenue(storeId);

    // const store = (
    //     await getDoc(doc(db, "stores", storeId))
    // ).data() as Store;

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="Dashboard" description="Overview of your store" />
                <Separator />

                <div className="grid gap-4 grid-cols-4">

                    <Card className="col-span-2">
                        <CardHeader className="flex items-center justify-between flex-row">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatter.format(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1">
                        <CardHeader className="flex items-center justify-between flex-row">
                            <CardTitle className="text-sm font-medium">
                                Sales
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{totalSales}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1">
                        <CardHeader className="flex items-center justify-between flex-row">
                            <CardTitle className="text-sm font-medium">
                                Products
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{totalProducts}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader className="flex items-center justify-between flex-row">
                            <CardTitle className="text-sm font-medium">
                                Revenue By Month
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Overview  data={monthlyGraphRevenue} />
                        </CardContent>
                    </Card>

                    <Card className="col-span-1">
                        <CardHeader className="flex items-center justify-between flex-row">
                            <CardTitle className="text-sm font-medium">
                                Revenue By Payment Status
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Overview  data={orderStatusTotalRevenue} />
                        </CardContent>
                    </Card> 

                    <Card className="col-span-2">
                        <CardHeader className="flex items-center justify-between flex-row">
                            <CardTitle className="text-sm font-medium">
                                Revenue By Category
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Overview  data={revenueBycategory} />
                        </CardContent>
                    </Card>    

                    <Card className="col-span-2">
                        <CardHeader className="flex items-center justify-between flex-row">
                            <CardTitle className="text-sm font-medium">
                                Revenue By Order Status
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Overview  data={revenueByOrderStatus} />
                        </CardContent>
                    </Card>                  
                    
                </div>
            </div>
        </div>
    )
}

export default DashboardOverview;