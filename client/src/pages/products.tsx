import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductGrid from "@/components/product/product-grid";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Search } from "lucide-react";

export default function Products() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Products page should be accessible to everyone - no auth required

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: products, error: productsError, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", { search: debouncedSearch, category }],
  });

  // Handle products error - show user friendly message
  useEffect(() => {
    if (productsError) {
      toast({
        title: "Error",
        description: "Failed to load products. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  }, [productsError, toast]);

  // Remove auth loading check since products don't require auth

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6" data-testid="products-title">All Products</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            
            <Select value={category} onValueChange={setCategory} data-testid="select-category">
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.isArray(categories) && categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(search || (category && category !== "all")) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground" data-testid="loading-message">Loading products...</p>
          </div>
        ) : products && products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4" data-testid="no-products-message">
              {search || (category && category !== "all") ? "No products found matching your criteria." : "No products available."}
            </p>
            {(search || (category && category !== "all")) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                data-testid="button-view-all"
              >
                View All Products
              </Button>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
