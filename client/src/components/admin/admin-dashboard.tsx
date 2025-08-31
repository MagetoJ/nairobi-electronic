import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductManagement from "./product-management";
import UserManagement from "./user-management";
import OrderManagement from "./order-management";
import { Package, Users, Clock, DollarSign, BarChart3, ShoppingBag, UserCheck, Settings } from "lucide-react";

const menuItems = [
  { id: "dashboard", name: "Dashboard", icon: BarChart3 },
  { id: "products", name: "Products", icon: Package },
  { id: "users", name: "Users", icon: Users },
  { id: "orders", name: "Orders", icon: ShoppingBag },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalProducts: string;
    totalUsers: string;
    pendingOrders: string;
    revenue: string;
  }>({
    queryKey: ["/api/admin/stats"],
  });

  const renderContent = () => {
    switch (activeSection) {
      case "products":
        return <ProductManagement />;
      case "users":
        return <UserManagement />;
      case "orders":
        return <OrderManagement />;
      default:
        return (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card data-testid="stat-card-products">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Total Products</p>
                      <p className="text-2xl font-bold" data-testid="stat-total-products">
                        {statsLoading ? "..." : (stats?.totalProducts || "0")}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card data-testid="stat-card-users">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Total Users</p>
                      <p className="text-2xl font-bold" data-testid="stat-total-users">
                        {statsLoading ? "..." : (stats?.totalUsers || "0")}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card data-testid="stat-card-pending-orders">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Pending Orders</p>
                      <p className="text-2xl font-bold" data-testid="stat-pending-orders">
                        {statsLoading ? "..." : (stats?.pendingOrders || "0")}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card data-testid="stat-card-revenue">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Revenue</p>
                      <p className="text-2xl font-bold" data-testid="stat-revenue">
                        {statsLoading ? "..." : (stats?.revenue || "KSh 0")}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Admin Access Info */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Panel Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Access Information</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• URL: <code className="bg-muted px-2 py-1 rounded">/admin</code></li>
                      <li>• Requires admin role in user account</li>
                      <li>• Database access: PostgreSQL with Drizzle ORM</li>
                      <li>• Authentication: Replit Auth with role-based access</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Database Tables</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <code className="bg-muted px-2 py-1 rounded">users</code> - User accounts and roles</li>
                      <li>• <code className="bg-muted px-2 py-1 rounded">products</code> - Product catalog</li>
                      <li>• <code className="bg-muted px-2 py-1 rounded">categories</code> - Product categories</li>
                      <li>• <code className="bg-muted px-2 py-1 rounded">orders</code> - Customer orders</li>
                      <li>• <code className="bg-muted px-2 py-1 rounded">order_items</code> - Order line items</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card rounded-xl p-6 mr-8 h-fit">
          <div className="flex items-center space-x-2 mb-8" data-testid="admin-logo">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">NE</span>
            </div>
            <span className="font-bold">Admin Panel</span>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(item.id)}
                  data-testid={`nav-${item.id}`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
