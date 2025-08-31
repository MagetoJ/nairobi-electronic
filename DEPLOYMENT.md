# Nairobi Electronics - Deployment Guide

This guide covers how to deploy Nairobi Electronics e-commerce platform to various hosting providers.

## Quick Setup for GitHub Transfer

1. **Prepare for GitHub Transfer**
   - Create a new GitHub repository
   - Copy all files except `.replit` and `replit.nix`
   - Ensure `package.json` has correct scripts
   - Set up environment variables in your hosting platform

2. **Required Environment Variables**
   ```
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret_key
   REPLIT_DOMAINS=your_domain.com
   ISSUER_URL=https://replit.com/oidc
   REPL_ID=your_repl_id
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

## Deployment Options

### Option 1: Vercel Deployment

1. **Prerequisites**
   - Vercel account
   - GitHub repository with your code
   - PostgreSQL database (Neon, PlanetScale, or Supabase)

2. **Setup Steps**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

3. **Configuration**
   - The `vercel.json` file is already configured
   - Add environment variables in Vercel dashboard
   - Connect your PostgreSQL database

4. **Database Setup**
   ```bash
   # After deployment, push your schema
   npm run db:push
   ```

### Option 2: Netlify Deployment

1. **Prerequisites**
   - Netlify account
   - GitHub repository
   - PostgreSQL database

2. **Setup Steps**
   - Connect GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `client/dist`
   - Configure environment variables

3. **Configuration**
   - The `netlify.toml` file is already configured
   - Enable Netlify Functions for API routes
   - Install serverless dependencies:
   ```bash
   npm install @netlify/functions serverless-http
   ```

### Option 3: Traditional VPS/Cloud Hosting

1. **Server Requirements**
   - Node.js 20+
   - PostgreSQL 14+
   - Nginx (recommended)
   - SSL certificate

2. **Setup Steps**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd nairobi-electronics
   
   # Install dependencies
   npm install
   
   # Build frontend
   npm run build
   
   # Set up database
   npm run db:push
   
   # Start with PM2
   npm install -g pm2
   pm2 start "npm run start" --name "nairobi-electronics"
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location / {
           root /path/to/your/app/client/dist;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## Database Migration

### From Development to Production

1. **Export Development Data** (if needed)
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

2. **Set up Production Database**
   - Create PostgreSQL database on your hosting provider
   - Update `DATABASE_URL` environment variable

3. **Push Schema**
   ```bash
   npm run db:push
   ```

4. **Import Data** (if needed)
   ```bash
   psql $PRODUCTION_DATABASE_URL < backup.sql
   ```

## Authentication Setup

### For Production Deployment

1. **Update Replit Auth Settings**
   - Add your production domain to `REPLIT_DOMAINS`
   - Update redirect URLs in Replit OAuth settings

2. **Alternative: Custom Auth**
   - If not using Replit Auth, implement custom authentication
   - Use providers like Auth0, Firebase Auth, or custom JWT

## Performance Optimization

1. **Frontend Optimizations**
   - Already configured with Vite for optimal builds
   - Includes code splitting and tree shaking
   - PWA manifest for mobile installation

2. **Backend Optimizations**
   - Database connection pooling configured
   - Session storage in PostgreSQL
   - Gzip compression enabled

3. **CDN Setup** (recommended)
   - Use Cloudflare or similar for static assets
   - Enable caching for images and CSS/JS files

## Monitoring and Maintenance

1. **Health Checks**
   - Set up uptime monitoring
   - Monitor database performance
   - Track error logs

2. **Backup Strategy**
   - Automated database backups
   - Code repository backup on GitHub
   - Environment variable backup

3. **Updates**
   - Keep dependencies updated
   - Monitor security vulnerabilities
   - Regular testing of core functionality

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify `DATABASE_URL` format
   - Check database server accessibility
   - Ensure connection pooling limits

2. **Authentication Issues**
   - Verify `SESSION_SECRET` is set
   - Check domain configuration
   - Validate OAuth settings

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables

### Getting Help

- Check logs for specific error messages
- Verify all environment variables are set
- Test database connectivity separately
- Review hosting provider documentation

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure session configuration
- [ ] Validate all environment variables
- [ ] Enable CORS appropriately
- [ ] Keep dependencies updated
- [ ] Use strong database passwords
- [ ] Enable database SSL
- [ ] Monitor for security vulnerabilities

## Post-Deployment Testing

1. **User Authentication**
   - Login/logout functionality
   - Session persistence
   - Password security

2. **E-commerce Features**
   - Product browsing
   - Cart functionality
   - Order processing
   - Admin dashboard

3. **Performance**
   - Page load times
   - Database query performance
   - Mobile responsiveness
   - PWA installation

---

For additional support or questions about deployment, refer to the hosting provider's documentation or contact the development team.