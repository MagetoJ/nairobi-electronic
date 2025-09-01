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

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show install button or trigger install logic
  const installButton = document.querySelector('#install-pwa-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
});

// Make install function available globally
(window as any).installPWA = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      deferredPrompt = null;
    });
  }
};

createRoot(document.getElementById("root")!).render(<App />);
