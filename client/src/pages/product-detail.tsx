import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Star, ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { ReviewsSection } from "@/components/product/reviews-section";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  categoryId: string;
  stock: number;
  images: string[];
  sku: string;
  rating: string;
  reviewCount: number;
  status: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [location, navigate] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', id],
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images[0] || '',
      quantity,
    });

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart`,
    });
  };

  const adjustQuantity = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
        <Link href="/products">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const rating = parseFloat(product.rating);

  return (
    <div className="container mx-auto px-4 py-8" data-testid="product-detail-page">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/products" className="hover:text-foreground">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden border">
            <img
              src={product.images[0] || '/api/placeholder/600/600'}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="product-image"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square rounded overflow-hidden border">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="product-name">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold text-primary" data-testid="product-price">
                KSh {parseFloat(product.price).toLocaleString()}
              </span>
              <Badge variant={product.stock > 0 ? "default" : "secondary"}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground" data-testid="product-description">
              {product.description}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Product Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">SKU:</span>
                <span className="ml-2 font-mono">{product.sku}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2 capitalize">{product.status}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Add to Cart Section */}
          {product.stock > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Quantity</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustQuantity(-1)}
                        disabled={quantity <= 1}
                        data-testid="quantity-decrease"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= 1 && value <= product.stock) {
                            setQuantity(value);
                          }
                        }}
                        className="w-20 text-center"
                        min="1"
                        max={product.stock}
                        data-testid="quantity-input"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustQuantity(1)}
                        disabled={quantity >= product.stock}
                        data-testid="quantity-increase"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum {product.stock} available
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span data-testid="total-price">
                      KSh {(parseFloat(product.price) * quantity).toLocaleString()}
                    </span>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full"
                    size="lg"
                    data-testid="add-to-cart-button"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {product.stock === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">This product is currently out of stock.</p>
              <Button variant="outline" disabled>
                Out of Stock
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-4">
        <ReviewsSection productId={product.id} />
      </div>
    </div>
  );
}