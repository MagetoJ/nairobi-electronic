import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import CartSidebar from "@/components/cart/cart-sidebar";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Search, ShoppingCart, User, Menu, X, UserPlus } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { items, getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  if (user && typeof user === 'object' && user !== null && 'email' in user && user.email === 'jabezmageto78@gmail.com') {
    navigation.push({ name: "Admin", href: "/admin" });
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">NE</span>
              </div>
              <span className="text-xl font-bold text-foreground">Nairobi Electronics</span>
            </Link>
            
            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-xl mx-8 hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search electronics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                  data-testid="input-search"
                />
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-muted-foreground" />
              </form>
            </div>
            
            {/* Navigation Actions */}
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-foreground ${
                      location === item.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                    data-testid={`nav-link-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Auth Button */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid="button-profile"
                    >
                      <User className="w-4 h-4 mr-2" />
                      <span className="hidden md:inline">Profile</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      try {
                        await fetch('/api/auth/logout', { method: 'POST' });
                        window.location.href = '/';
                      } catch (error) {
                        console.error('Logout error:', error);
                        window.location.href = '/';
                      }
                    }}
                    data-testid="button-logout"
                    className="hidden md:flex"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLoginOpen(true)}
                    data-testid="button-login"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span className="hidden md:inline">Sign In</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsRegisterOpen(true)}
                    data-testid="button-register"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                </div>
              )}
              
              {/* Cart Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative"
                data-testid="button-cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 px-2 py-1 text-xs"
                    data-testid="cart-count"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Search electronics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10"
                    data-testid="input-search-mobile"
                  />
                  <Search className="w-5 h-5 absolute left-3 top-2.5 text-muted-foreground" />
                </form>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-4 py-2 text-sm font-medium transition-colors hover:text-foreground ${
                        location === item.href
                          ? "text-foreground bg-accent"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`nav-link-mobile-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Mobile Auth Buttons */}
                  {!isAuthenticated && (
                    <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIsLoginOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="justify-start px-4"
                        data-testid="button-login-mobile"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => {
                          setIsRegisterOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="justify-start px-4"
                        data-testid="button-register-mobile"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Register
                      </Button>
                    </div>
                  )}
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Auth Modals */}
      <LoginForm isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegisterForm 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
}
