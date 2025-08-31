import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Package, MapPin, Phone, Clock, DollarSign, CheckCircle, Truck } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
  product?: {
    id: string;
    name: string;
    images: string[] | null;
  };
}

interface Order {
  id: string;
  userId: string;
  status: string;
  total: string;
  shippingAddress: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  items?: OrderItem[];
}

export default function OrderManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      await apiRequest(`/api/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Success",
        description: "Order status updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatusMutation.mutate({ orderId, status: newStatus });
  };

  const getUserDisplayName = (order: Order) => {
    if (order.user?.firstName && order.user?.lastName) {
      return `${order.user.firstName} ${order.user.lastName}`;
    }
    if (order.user?.firstName) {
      return order.user.firstName;
    }
    return order.user?.email || 'Unknown User';
  };

  const getUserInitials = (order: Order) => {
    if (order.user?.firstName && order.user?.lastName) {
      return `${order.user.firstName[0]}${order.user.lastName[0]}`.toUpperCase();
    }
    if (order.user?.firstName) {
      return order.user.firstName[0].toUpperCase();
    }
    if (order.user?.email) {
      return order.user.email[0].toUpperCase();
    }
    return "U";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'default';
      case 'confirmed':
        return 'secondary';
      case 'processing':
        return 'outline';
      case 'shipped':
        return 'default';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const completedOrders = orders?.filter(order => order.status === 'delivered').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
          <p className="text-muted-foreground">
            View and manage all customer orders
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-2xl font-bold">
                  {ordersLoading ? "..." : (orders?.length || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending Orders</p>
                <p className="text-2xl font-bold">
                  {ordersLoading ? "..." : pendingOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Completed</p>
                <p className="text-2xl font-bold">
                  {ordersLoading ? "..." : completedOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-green/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {ordersLoading ? "..." : `KSh ${totalRevenue.toLocaleString()}`}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Delivery Info</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <div className="text-sm">
                          {order.id.split('-')[0]}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getUserInitials(order)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">
                              {getUserDisplayName(order)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.user?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items?.map((item, index) => (
                            <div key={item.id} className="text-sm">
                              <span className="font-medium">{item.product?.name || 'Unknown Product'}</span>
                              <span className="text-muted-foreground"> x{item.quantity}</span>
                            </div>
                          )) || (
                            <span className="text-sm text-muted-foreground">No items</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          KSh {parseFloat(order.total).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-sm">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground truncate max-w-[150px]">
                              {order.shippingAddress}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {order.phone}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                              disabled={updateOrderStatusMutation.isPending}
                              data-testid={`confirm-order-${order.id}`}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirm
                            </Button>
                          )}
                          {(order.status === 'confirmed' || order.status === 'processing') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(order.id, 'shipped')}
                              disabled={updateOrderStatusMutation.isPending}
                              data-testid={`ship-order-${order.id}`}
                            >
                              <Truck className="w-4 h-4 mr-1" />
                              Ship
                            </Button>
                          )}
                          {order.status === 'shipped' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, 'delivered')}
                              disabled={updateOrderStatusMutation.isPending}
                              data-testid={`deliver-order-${order.id}`}
                            >
                              <Package className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {orders?.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}