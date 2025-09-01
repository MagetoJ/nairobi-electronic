async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Mock API for frontend-only demo
function mockApiRequest(url: string, options: RequestInit = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url === '/api/auth/user') {
        // Check if user is logged in
        const user = localStorage.getItem('demo_user');
        if (user) {
          resolve(JSON.parse(user));
        } else {
          reject(new Error('Not authenticated'));
        }
      } else if (url === '/api/auth/login' && options.method === 'POST') {
        // Mock login
        const body = JSON.parse((options as any).body || '{}');
        if (body.email && body.password) {
          const user = {
            id: 1,
            email: body.email,
            name: body.email.split('@')[0],
            role: body.email === 'jabezmageto78@gmail.com' ? 'admin' : 'user'
          };
          localStorage.setItem('demo_user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      } else if (url === '/api/auth/register' && options.method === 'POST') {
        // Mock registration
        const body = JSON.parse((options as any).body || '{}');
        if (body.email && body.password) {
          const user = {
            id: Date.now(),
            email: body.email,
            name: body.name || body.email.split('@')[0],
            role: 'user'
          };
          localStorage.setItem('demo_user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Registration failed'));
        }
      } else if (url === '/api/auth/logout') {
        localStorage.removeItem('demo_user');
        resolve({ success: true });
      } else if (url.startsWith('/api/products')) {
        // Mock products data
        const products = [
          {
            id: 1,
            name: "MacBook Pro 16",
            price: 299999,
            category: "Laptops",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
            description: "Latest MacBook Pro with M3 chip"
          },
          {
            id: 2,
            name: "iPhone 15 Pro",
            price: 149999,
            category: "Smartphones", 
            image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
            description: "Latest iPhone with advanced features"
          },
          {
            id: 3,
            name: "Gaming Desktop",
            price: 199999,
            category: "Desktops",
            image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400",
            description: "High-performance gaming desktop"
          }
        ];
        resolve(products);
      } else {
        reject(new Error('Endpoint not found'));
      }
    }, 500); // Simulate network delay
  });
}

export async function apiRequest(
  url: string,
  options: RequestInit | string = {}
): Promise<any> {
  let finalOptions: RequestInit;

  if (typeof options === 'string') {
    // If options is a string, treat it as the method
    finalOptions = {
      method: options,
      credentials: "include",
    };
  } else {
    // If options is an object, use it as RequestInit
    finalOptions = {
      ...options,
      credentials: "include",
    };
  }

  // Check if we're in a deployed environment without backend
  const isStaticDeployment = !window.location.hostname.includes('localhost') && 
                            !window.location.hostname.includes('replit');

  if (isStaticDeployment) {
    // Use mock API for demo
    return mockApiRequest(url, finalOptions);
  }

  try {
    const res = await fetch(url, finalOptions);
    await throwIfResNotOk(res);
    
    if (res.headers.get('content-type')?.includes('application/json')) {
      return await res.json();
    }
    
    return res;
  } catch (error) {
    // Fallback to mock API if real API fails
    return mockApiRequest(url, finalOptions);
  }
}