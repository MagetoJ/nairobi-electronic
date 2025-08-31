import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Clock, MapPin, Phone, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function OrderSuccess() {
  const [location] = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // In a real app, you'd get order details from URL params or API
  useEffect(() => {
    // Mock order details - in real app, get from URL params or API
    const mockOrder = {
      id: "ORD-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
      total: "125000.00",
      items: [
        { name: "Samsung Galaxy S24", quantity: 1, price: "125000.00" }
      ],
      shippingAddress: "10 Woodvale Grove, Nairobi",
      phone: "+254 717 888 333",
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
    };
    setOrderDetails(mockOrder);
  }, []);

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="order-success-page">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2" data-testid="success-title">
            Order Placed Successfully!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll contact you shortly to confirm delivery details.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <Badge variant="secondary" data-testid="order-id">
                {orderDetails.id}
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-2">Items Ordered</h3>
                <div className="space-y-2">
                  {orderDetails.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">KSh {parseFloat(item.price).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <span data-testid="order-total">KSh {parseFloat(orderDetails.total).toLocaleString()}</span>
              </div>

              <Separator />

              {/* Delivery Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {orderDetails.shippingAddress}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Phone
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {orderDetails.phone}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Payment Method */}
              <div>
                <h4 className="font-medium mb-2">Payment Method</h4>
                <Badge variant="outline">Cash on Delivery</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Pay when your order is delivered to you
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              What Happens Next?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Order Confirmation</h4>
                  <p className="text-sm text-muted-foreground">
                    We'll call you within 30 minutes to confirm your order and delivery details
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Order Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    Your order will be prepared and packed for delivery
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Expected delivery: {orderDetails.estimatedDelivery.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about your order, don't hesitate to contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm">+254 717 888 333</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-sm">Order ID: {orderDetails.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/orders">
            <Button variant="outline" className="w-full" data-testid="view-orders-button">
              <Package className="w-4 h-4 mr-2" />
              View Order History
            </Button>
          </Link>
          
          <Link href="/products">
            <Button className="w-full" data-testid="continue-shopping-button">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}