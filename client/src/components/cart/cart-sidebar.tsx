import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { X, Plus, Minus, CreditCard } from "lucide-react";
import { useState } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");

  const checkoutMutation = useMutation({
    mutationFn: async (orderData: {
      items: { productId: string; quantity: number }[];
      shippingAddress: string;
      phone: string;
    }) => {
      await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order placed successfully!",
        description: "Your order has been placed. You'll receive a call to confirm delivery details.",
      });
      clearCart();
      setIsCheckingOut(false);
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Order failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to place an order.",
        variant: "destructive",
      });
      window.location.href = "/api/login";
      return;
    }

    if (!shippingAddress || !phone) {
      toast({
        title: "Missing information",
        description: "Please provide shipping address and phone number.",
        variant: "destructive",
      });
      return;
    }

    const orderItems = items.map(item => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    checkoutMutation.mutate({
      items: orderItems,
      shippingAddress,
      phone,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        data-testid="cart-backdrop"
      />
      
      {/* Sidebar */}
      <div 
        className="fixed right-0 top-0 h-full w-96 bg-card shadow-2xl z-50 flex flex-col"
        data-testid="cart-sidebar"
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold" data-testid="cart-title">Shopping Cart</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-cart"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="empty-cart-message">
                Your cart is empty
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex space-x-4 border-b border-border pb-4"
                  data-testid={`cart-item-${item.id}`}
                >
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                      data-testid={`cart-item-image-${item.id}`}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">No Image</span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h4 className="font-medium" data-testid={`cart-item-name-${item.id}`}>
                      {item.name}
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid={`cart-item-price-${item.id}`}>
                      KSh {item.price.toLocaleString()}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center" data-testid={`cart-item-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-remove-${item.id}`}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Checkout Section */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border">
            <div className="space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span data-testid="cart-total">KSh {getTotal().toLocaleString()}</span>
              </div>
              
              {/* Payment Method Info */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-sm">Cash on Delivery</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pay when your order arrives at your doorstep
                </p>
              </div>

              {/* Checkout Form */}
              {isCheckingOut ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Shipping Address
                    </label>
                    <Input
                      placeholder="Enter your full address"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      data-testid="input-address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <Input
                      placeholder="07XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      data-testid="input-phone"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCheckingOut(false)}
                      className="flex-1"
                      data-testid="button-cancel-checkout"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      disabled={checkoutMutation.isPending}
                      className="flex-1"
                      data-testid="button-place-order"
                    >
                      {checkoutMutation.isPending ? "Placing Order..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full"
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
