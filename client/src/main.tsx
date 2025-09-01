import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Service Worker Registration
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

// PWA Install Prompt
let deferredPrompt: any = null;

// Handle the install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA: beforeinstallprompt fired');
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('pwa-installable'));
});

// Handle successful installation
window.addEventListener('appinstalled', (e) => {
  console.log('PWA: App was installed');
  deferredPrompt = null;
  // Dispatch custom event to hide install button
  window.dispatchEvent(new CustomEvent('pwa-installed'));
});

// Make install function available globally
(window as any).installPWA = () => {
  console.log('PWA: Install triggered, deferredPrompt:', !!deferredPrompt);
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      console.log('PWA: User choice:', choiceResult.outcome);
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      deferredPrompt = null;
    });
  } else {
    console.log('PWA: No deferred prompt available');
    // For iOS Safari and other browsers that don't support beforeinstallprompt
    alert('To install this app:\n\n1. Tap the Share button\n2. Select "Add to Home Screen"\n3. Tap "Add"');
  }
};

// Check if already installed (for display-mode: standalone)
(window as any).isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};

createRoot(document.getElementById("root")!).render(<App />);
