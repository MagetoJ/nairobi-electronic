import {
  users,
  categories,
  products,
  orders,
  orderItems,
  reviews,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, desc, asc, and, or, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUserWithPassword(user: { email: string; firstName: string; lastName: string; password: string }): Promise<User>;
  validateUserPassword(email: string, password: string): Promise<User | null>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: { email: string; firstName: string; lastName?: string; role?: string }): Promise<User>;
  deleteUser(id: string): Promise<void>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  
  // Product operations
  getProducts(filters?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Order operations
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  
  // Order items operations
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Review operations
  getProductReviews(productId: string): Promise<Review[]>;
  getUserReviews(userId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: string, review: Partial<InsertReview>): Promise<Review>;
  deleteReview(id: string): Promise<void>;
  incrementReviewHelpful(id: string): Promise<Review>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getOrdersWithDetails(): Promise<any[]>;
  getOrderWithUser(id: string): Promise<any>;
  getStats(): Promise<{
    totalProducts: number;
    totalUsers: number;
    pendingOrders: number;
    revenue: string;
  }>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(userData: { email: string; firstName: string; lastName?: string; role?: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName || null,
        role: userData.role || 'user',
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async createUserWithPassword(userData: { email: string; firstName: string; lastName: string; password: string }): Promise<User> {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
        authProvider: 'local',
        isEmailVerified: false,
      })
      .returning();
    return user;
  }
  
  async validateUserPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password) return null;
    
    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Product operations
  async getProducts(filters?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> {
    const conditions = [eq(products.status, "active")];

    if (filters?.category) {
      conditions.push(eq(products.categoryId, filters.category));
    }

    if (filters?.search) {
      const searchCondition = or(
        ilike(products.name, `%${filters.search}%`),
        ilike(products.description, `%${filters.search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    let baseQuery = db.select().from(products).where(and(...conditions))
      .orderBy(desc(products.createdAt));

    if (filters?.limit && filters?.offset) {
      return await baseQuery.limit(filters.limit).offset(filters.offset);
    } else if (filters?.limit) {
      return await baseQuery.limit(filters.limit);
    } else if (filters?.offset) {
      return await baseQuery.offset(filters.offset);
    }

    return await baseQuery;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.status, "active"))
      .orderBy(desc(products.rating))
      .limit(limit);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Order operations
  async getOrders(userId?: string): Promise<Order[]> {
    if (userId) {
      return await db.select().from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));
    }
    
    return await db.select().from(orders)
      .orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Order items operations
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  // Admin operations
  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getOrdersWithDetails(): Promise<any[]> {
    const ordersWithDetails = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        status: orders.status,
        total: orders.total,
        shippingAddress: orders.shippingAddress,
        phone: orders.phone,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      ordersWithDetails.map(async (order) => {
        const items = await db
          .select({
            id: orderItems.id,
            orderId: orderItems.orderId,
            productId: orderItems.productId,
            quantity: orderItems.quantity,
            price: orderItems.priceAtTime,
            product: {
              id: products.id,
              name: products.name,
              images: products.images,
            },
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          items,
        };
      })
    );

    return ordersWithItems;
  }

  async getOrderWithUser(id: string): Promise<any> {
    const [orderWithUser] = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        status: orders.status,
        total: orders.total,
        shippingAddress: orders.shippingAddress,
        phone: orders.phone,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.id, id));

    return orderWithUser;
  }

  // Review operations
  async getProductReviews(productId: string): Promise<Review[]> {
    const productReviews = await db
      .select({
        id: reviews.id,
        productId: reviews.productId,
        userId: reviews.userId,
        rating: reviews.rating,
        title: reviews.title,
        comment: reviews.comment,
        verified: reviews.verified,
        helpful: reviews.helpful,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        userName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
        userInitials: sql<string>`CONCAT(LEFT(${users.firstName}, 1), LEFT(${users.lastName}, 1))`,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));

    return productReviews as any;
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.userId, userId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Update product rating
    await this.updateProductRating(review.productId);
    
    return newReview;
  }

  async updateReview(id: string, reviewData: Partial<InsertReview>): Promise<Review> {
    const [updatedReview] = await db
      .update(reviews)
      .set({ ...reviewData, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();

    // Update product rating if rating changed
    if (reviewData.rating) {
      await this.updateProductRating(updatedReview.productId);
    }

    return updatedReview;
  }

  async deleteReview(id: string): Promise<void> {
    const [deletedReview] = await db.delete(reviews).where(eq(reviews.id, id)).returning();
    
    // Update product rating after deletion
    if (deletedReview) {
      await this.updateProductRating(deletedReview.productId);
    }
  }

  async incrementReviewHelpful(id: string): Promise<Review> {
    const [updatedReview] = await db
      .update(reviews)
      .set({ helpful: sql`${reviews.helpful} + 1` })
      .where(eq(reviews.id, id))
      .returning();

    return updatedReview;
  }

  private async updateProductRating(productId: string): Promise<void> {
    const ratingData = await db
      .select({
        avgRating: sql<number>`ROUND(AVG(CAST(${reviews.rating} AS DECIMAL)), 2)`,
        reviewCount: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(eq(reviews.productId, productId));

    if (ratingData[0]) {
      await db
        .update(products)
        .set({
          rating: ratingData[0].avgRating?.toString(),
          reviewCount: ratingData[0].reviewCount || 0,
        })
        .where(eq(products.id, productId));
    }
  }

  async getStats(): Promise<{
    totalProducts: number;
    totalUsers: number;
    pendingOrders: number;
    revenue: string;
  }> {
    const productCount = await db.select({ count: sql<number>`count(*)` }).from(products);
    const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);
    const pendingOrderCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "pending"));
    const revenueResult = await db
      .select({ total: sql<string>`COALESCE(sum(total), 0)` })
      .from(orders)
      .where(eq(orders.status, "delivered"));

    return {
      totalProducts: productCount[0]?.count || 0,
      totalUsers: userCount[0]?.count || 0,
      pendingOrders: pendingOrderCount[0]?.count || 0,
      revenue: `KSh ${Number(revenueResult[0]?.total || 0).toLocaleString()}`,
    };
  }
}

export const storage = new DatabaseStorage();
