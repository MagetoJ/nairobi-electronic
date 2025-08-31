import { Link } from "wouter";
import { Phone, MapPin, Shield, CreditCard, Headphones } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4" data-testid="footer-logo">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">NE</span>
              </div>
              <span className="text-lg font-bold">Nairobi Electronics</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4" data-testid="footer-description">
              Kenya's premier electronics marketplace offering the latest technology with reliable cash on delivery service.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm" data-testid="contact-phone">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>0717888333</span>
              </div>
              <div className="flex items-center space-x-2 text-sm" data-testid="contact-address">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>10 Woodvale Grove, Nairobi</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-quicklinks-title">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground" data-testid="link-about">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground" data-testid="link-contact">Contact</Link></li>
              <li><Link href="/shipping" className="hover:text-foreground" data-testid="link-shipping">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-foreground" data-testid="link-returns">Returns</Link></li>
              <li><Link href="/warranty" className="hover:text-foreground" data-testid="link-warranty">Warranty</Link></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-categories-title">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products?category=laptops" className="hover:text-foreground" data-testid="link-laptops">Laptops</Link></li>
              <li><Link href="/products?category=smartphones" className="hover:text-foreground" data-testid="link-smartphones">Smartphones</Link></li>
              <li><Link href="/products?category=gaming" className="hover:text-foreground" data-testid="link-gaming">Gaming</Link></li>
              <li><Link href="/products?category=audio" className="hover:text-foreground" data-testid="link-audio">Audio</Link></li>
              <li><Link href="/products?category=accessories" className="hover:text-foreground" data-testid="link-accessories">Accessories</Link></li>
            </ul>
          </div>
          
          {/* Payment & Support */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-support-title">Payment & Support</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2" data-testid="payment-cod">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span className="text-sm">Cash on Delivery</span>
              </div>
              <div className="flex items-center space-x-2" data-testid="security-secure">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm">Secure Shopping</span>
              </div>
              <div className="flex items-center space-x-2" data-testid="support-24-7">
                <Headphones className="w-5 h-5 text-green-600" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground" data-testid="copyright">
              &copy; 2024 Nairobi Electronics. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-privacy">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-terms">
                Terms of Service
              </Link>
              <Link href="/sitemap.xml" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-sitemap">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
