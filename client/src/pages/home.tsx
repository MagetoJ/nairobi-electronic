import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductGrid from "@/components/product/product-grid";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Laptop, Smartphone, Gamepad2, Headphones, HardDrive, Monitor } from "lucide-react";

const categories = [
  { name: "Laptops", icon: Laptop },
  { name: "Smartphones", icon: Smartphone },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Audio", icon: Headphones },
  { name: "Components", icon: HardDrive },
  { name: "Monitors", icon: Monitor },
];

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: featuredProducts, error: productsError } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Handle products error
  useEffect(() => {
    if (productsError && isUnauthorizedError(productsError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [productsError, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-xl">NE</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4" data-testid="hero-title">
                Latest Electronics
              </h1>
              <p className="text-xl mb-6 opacity-90" data-testid="hero-description">
                Discover cutting-edge technology at unbeatable prices. From laptops to smartphones - we've got everything you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  data-testid="button-shop-now"
                >
                  Shop Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  data-testid="button-view-deals"
                >
                  View Deals
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1547082299-de196ea013d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern computer setup" 
                className="rounded-xl shadow-2xl w-full h-auto" 
                data-testid="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="categories-title">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.name} 
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  data-testid={`category-card-${index}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm" data-testid={`category-name-${index}`}>
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 lg:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold" data-testid="featured-products-title">
              Featured Products
            </h2>
            <Button 
              variant="link" 
              className="text-primary"
              data-testid="link-view-all"
            >
              View All
            </Button>
          </div>
          
          {featuredProducts ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="no-products-message">
                No featured products available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2" data-testid="offer-weekend-title">Weekend Sale</h3>
                  <p className="mb-4 opacity-90" data-testid="offer-weekend-description">
                    Up to 30% off on selected laptops
                  </p>
                  <Button 
                    variant="secondary"
                    data-testid="button-shop-sale"
                  >
                    Shop Sale
                  </Button>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-10">
                  <Laptop className="w-32 h-32" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-accent to-muted border overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2" data-testid="offer-delivery-title">Free Delivery</h3>
                  <p className="mb-4 text-muted-foreground" data-testid="offer-delivery-description">
                    Cash on delivery available for all orders in Nairobi
                  </p>
                  <Button data-testid="button-learn-more">
                    Learn More
                  </Button>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-10">
                  <div className="w-32 h-32 flex items-center justify-center">
                    <span className="text-6xl">💰</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
