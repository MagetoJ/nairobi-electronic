import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0] || "",
      quantity: 1,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow group" data-testid={`product-card-${product.id}`}>
      <CardContent className="p-6">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform"
            data-testid={`product-image-${product.id}`}
          />
        ) : (
          <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="font-semibold text-lg" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm" data-testid={`product-description-${product.id}`}>
            {product.description}
          </p>
          
          {product.rating && (
            <div className="flex items-center space-x-2" data-testid={`product-rating-${product.id}`}>
              <div className="flex">
                {renderStars(parseFloat(product.rating))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount || 0} reviews)
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary" data-testid={`product-price-${product.id}`}>
              KSh {parseFloat(product.price).toLocaleString()}
            </span>
            <div className="flex items-center space-x-2">
              {product.stock && product.stock > 0 ? (
                <>
                  <Badge variant="secondary" data-testid={`product-stock-${product.id}`}>
                    {product.stock} in stock
                  </Badge>
                  <Button 
                    onClick={handleAddToCart}
                    data-testid={`button-add-to-cart-${product.id}`}
                  >
                    Add to Cart
                  </Button>
                </>
              ) : (
                <Badge variant="destructive" data-testid={`product-out-of-stock-${product.id}`}>
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
