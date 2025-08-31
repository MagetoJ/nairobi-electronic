import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search as SearchIcon, Filter, SortAsc, X } from "lucide-react";
import ProductGrid from "@/components/product/product-grid";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  categoryId: string;
  stock: number | null;
  images: string[] | null;
  sku: string | null;
  rating: string | null;
  reviewCount: number | null;
  status: string | null;
  specifications: unknown;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function Search() {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  
  // Get search params from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const query = params.get('q') || '';
    const category = params.get('category') || '';
    setSearchQuery(query);
    setSelectedCategory(category);
  }, [location]);

  // Update URL when filters change
  const updateUrl = (query: string, category: string) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    const newUrl = params.toString() ? `/search?${params.toString()}` : '/search';
    navigate(newUrl);
  };

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products', { search: searchQuery, category: selectedCategory }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedCategory) params.set('categoryId', selectedCategory);
      return fetch(`/api/products?${params.toString()}`).then(res => res.json());
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(searchQuery, selectedCategory);
  };

  const handleCategoryFilter = (categoryId: string) => {
    const newCategory = categoryId === selectedCategory ? '' : categoryId;
    setSelectedCategory(newCategory);
    updateUrl(searchQuery, newCategory);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    navigate('/search');
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'rating':
        return parseFloat(b.rating || '0') - parseFloat(a.rating || '0');
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const hasActiveFilters = searchQuery || selectedCategory;
  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name;

  return (
    <div className="container mx-auto px-4 py-8" data-testid="search-page">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4" data-testid="page-title">
          {hasActiveFilters ? 'Search Results' : 'Search Products'}
        </h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="search-input"
            />
          </div>
          <Button type="submit" data-testid="search-button">
            <SearchIcon className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm font-medium">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: "{searchQuery}"
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => {
                    setSearchQuery("");
                    updateUrl("", selectedCategory);
                  }}
                />
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                Category: {selectedCategoryName}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleCategoryFilter(selectedCategory)}
                />
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategory === category.id}
                        onChange={() => handleCategoryFilter(category.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Sort Options */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <SortAsc className="w-4 h-4" />
                  Sort By
                </h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  data-testid="sort-select"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="rating">Rating (High to Low)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Error Loading Products</h3>
              <p className="text-muted-foreground">
                We couldn't load the search results. Please try again.
              </p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "Start by searching for products or browsing categories."
                }
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground" data-testid="results-count">
                  {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
                  {searchQuery && ` for "${searchQuery}"`}
                  {selectedCategoryName && ` in ${selectedCategoryName}`}
                </p>
              </div>
              
              <ProductGrid products={sortedProducts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}