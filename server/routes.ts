import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { insertProductSchema, insertCategorySchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { generateSitemap } from "./sitemap";
import { sendWelcomeEmail, sendOrderDispatchEmail } from "./emailService";
import * as bcrypt from 'bcryptjs';

// Extend Express session to include user
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    user?: any;
  }
}

// Database authentication middleware
const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up database session storage
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: 7 * 24 * 60 * 60, // 1 week
    tableName: "sessions",
  });

  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'nairobi-electronics-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const { password: _, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Password-based authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, firstName, lastName, password } = req.body;

      if (!email || !firstName || !password) {
        return res.status(400).json({ message: "Email, first name, and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      // Create user
      const user = await storage.createUserWithPassword({
        email,
        firstName,
        lastName: lastName || '',
        password,
      });

      // Send welcome email
      try {
        await sendWelcomeEmail(email, firstName);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail registration if email fails
      }

      // Create session for new user
      req.session.userId = user.id;
      req.session.user = user;
      
      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Validate user credentials
      const user = await storage.validateUserPassword(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create session
      req.session.userId = user.id;
      req.session.user = user;
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        message: "Login successful",
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (req.user?.email !== 'jabezmageto78@gmail.com') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const { categoryId, search, limit, offset } = req.query;
      const products = await storage.getProducts({
        category: categoryId as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/featured', async (req, res) => {
    try {
      const { limit } = req.query;
      const products = await storage.getFeaturedProducts(
        limit ? parseInt(limit as string) : undefined
      );
      res.json(products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (req.user?.email !== 'jabezmageto78@gmail.com') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (req.user?.email !== 'jabezmageto78@gmail.com') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (req.user?.email !== 'jabezmageto78@gmail.com') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteProduct(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Order routes
  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      let orders;
      if (user?.role === 'admin') {
        orders = await storage.getOrders(); // Admin sees all orders
      } else {
        orders = await storage.getOrders(userId); // Users see only their orders
      }
      
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { items, shippingAddress, phone, notes } = req.body;

      // Calculate total
      let total = 0;
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          total += parseFloat(product.price) * item.quantity;
        }
      }

      const orderData = insertOrderSchema.parse({
        userId,
        total: total.toString(),
        shippingAddress,
        phone,
        notes,
        paymentMethod: 'cash_on_delivery',
      });

      const order = await storage.createOrder(orderData);

      // Create order items
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          await storage.createOrderItem({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtTime: product.price,
          });
        }
      }

      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put('/api/orders/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (req.user?.email !== 'jabezmageto78@gmail.com') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      
      // Send dispatch email when order is shipped
      if (status === 'shipped') {
        try {
          const orderWithUser = await storage.getOrderWithUser(req.params.id);
          if (orderWithUser && orderWithUser.user?.email && orderWithUser.user?.firstName) {
            await sendOrderDispatchEmail(
              orderWithUser.user.email,
              orderWithUser.user.firstName,
              orderWithUser.id,
              orderWithUser.shippingAddress
            );
          }
        } catch (emailError) {
          console.error('Failed to send dispatch email:', emailError);
          // Don't fail the status update if email fails
        }
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (req.user?.email !== 'jabezmageto78@gmail.com') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Admin Users endpoint
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (req.user?.email !== 'jabezmageto78@gmail.com') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Admin Orders endpoint with detailed information
  app.get('/api/admin/orders', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (req.user?.email !== 'jabezmageto78@gmail.com') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const orders = await storage.getOrdersWithDetails();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Admin user management endpoints
  app.post('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (req.user?.email !== 'jabezmageto78@gmail.com') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { email, firstName, lastName } = req.body;
      if (!email || !firstName) {
        return res.status(400).json({ message: "Email and first name are required" });
      }

      const newUser = await storage.createUser({
        email,
        firstName,
        lastName,
        role: 'user',
      });

      // Send welcome email
      try {
        await sendWelcomeEmail(email, firstName);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the user creation if email fails
      }

      res.json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.delete('/api/admin/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (req.user?.email !== 'jabezmageto78@gmail.com') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const userToDelete = await storage.getUser(req.params.id);
      if (!userToDelete) {
        return res.status(404).json({ message: "User not found" });
      }

      if (userToDelete.email === 'jabezmageto78@gmail.com') {
        return res.status(403).json({ message: "Cannot delete the main admin user" });
      }

      await storage.deleteUser(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // SEO routes
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const sitemap = await generateSitemap();
      res.set('Content-Type', 'text/xml');
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send('Error generating sitemap');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
