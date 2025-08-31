import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Profile from "@/pages/profile";
import Orders from "@/pages/orders";
import Search from "@/pages/search";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import OrderSuccess from "@/pages/order-success";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/" component={isAuthenticated ? Home : Landing} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/search" component={Search} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/profile" component={Profile} />
      <Route path="/orders" component={Orders} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/order-success" component={OrderSuccess} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function PWAInstaller() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Handle PWA installation prompt
    let deferredPrompt: any;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show custom install button after a delay
      setTimeout(() => {
        const installBanner = document.createElement('div');
        installBanner.innerHTML = `
          <div id="pwa-install-banner" style="
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: #3b82f6;
            color: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: between;
          ">
            <div style="flex: 1;">
              <strong>Install Nairobi Electronics App</strong>
              <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">Shop faster with our mobile app</p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button id="pwa-dismiss" style="
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
              ">Later</button>
              <button id="pwa-install" style="
                background: white;
                border: none;
                color: #3b82f6;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
              ">Install</button>
            </div>
          </div>
        `;
        
        document.body.appendChild(installBanner);
        
        document.getElementById('pwa-install')?.addEventListener('click', () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult: any) => {
              if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the PWA install prompt');
              }
              deferredPrompt = null;
            });
          }
          document.getElementById('pwa-install-banner')?.remove();
        });
        
        document.getElementById('pwa-dismiss')?.addEventListener('click', () => {
          document.getElementById('pwa-install-banner')?.remove();
        });
      }, 5000);
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      document.getElementById('pwa-install-banner')?.remove();
    });
  }, []);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <PWAInstaller />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
