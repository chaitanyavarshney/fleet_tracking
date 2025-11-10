// components/organisms/DashboardContent.tsx
import { JSX } from "react";
import { StatCard } from "../atoms/StatCard";
import { DollarSign, Users, ShoppingCart, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardContent(): JSX.Element {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value="$45,231.89" 
          icon={DollarSign} 
          trend="up" 
          trendValue="20.1% from last month" 
        />
        <StatCard 
          title="Active Users" 
          value="2,740" 
          icon={Users} 
          trend="up" 
          trendValue="12% from last month" 
        />
        <StatCard 
          title="Sales" 
          value="12,234" 
          icon={ShoppingCart} 
          trend="down" 
          trendValue="4% from last month" 
        />
        <StatCard 
          title="Active Sessions" 
          value="573" 
          icon={Activity} 
          trend="up" 
          trendValue="8% from last month" 
        />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made 265 sales this month</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Sales chart would go here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>+2.5% from last month</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conversion chart would go here</p>
              </CardContent>
            </Card>
            
            <Card className="col-span-full lg:col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Activity feed would go here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>In-depth performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics content would go here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Monthly and quarterly summaries</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Reports content would go here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}