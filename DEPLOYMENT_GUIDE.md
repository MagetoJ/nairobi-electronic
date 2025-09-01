# Deployment Guide

This guide provides step-by-step instructions for deploying the Nairobi Electronics application to various platforms.

## 🌐 Platform-Specific Deployment

### Vercel Deployment ⚡

1. **Import Project**:
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"  
   - Import from GitHub: `https://github.com/MagetoJ/nairobi-electronic.git`
   - The project is already deployed and should auto-update with new commits

2. **Configure Build Settings**:
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

3. **Environment Variables** (Add these in Vercel Dashboard):
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://neondb_owner:npg_JaK3V7SCcmDy@ep-sparkling-star-afvnppig.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
   SESSION_SECRET=AT69ELwkaVfA0ZsZLHOLXDjDebGt7mioObap0/lll/RbuPgaRd9w9/q849+SVSR1SZ6inMn+1q15TYOKrL3jAg==
   REPLIT_ID=pc-shop-eight.vercel.app
   EMAIL_USER=jabezmageto78@gmail.com
   EMAIL_PASSWORD=kwjn rrno dnbm usxl
   ```

4. **Deploy**: Click "Deploy" and Vercel will build and deploy automatically.

### Netlify Deployment 🚀

1. **Connect Repository**:
   - Visit [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select the repository

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Base directory: (leave empty)

3. **Environment Variables** (Add in Site Settings → Environment Variables):
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://neondb_owner:npg_JaK3V7SCcmDy@ep-sparkling-star-afvnppig.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
   SESSION_SECRET=AT69ELwkaVfA0ZsZLHOLXDjDebGt7mioObap0/lll/RbuPgaRd9w9/q849+SVSR1SZ6inMn+1q15TYOKrL3jAg==
   REPLIT_ID=your-netlify-domain.netlify.app
   EMAIL_USER=jabezmageto78@gmail.com
   EMAIL_PASSWORD=kwjn rrno dnbm usxl
   ```

4. **Deploy**: Click "Deploy site" and Netlify will handle the build process.

## 🔧 Post-Deployment Configuration

### Database Setup
The application uses the provided Neon PostgreSQL database which is already configured and ready to use.

### Domain Configuration
- Update the `REPLIT_ID` environment variable with your actual domain
- For Vercel: `your-app-name.vercel.app`
- For Netlify: `your-app-name.netlify.app`

### SSL Certificate
Both Vercel and Netlify provide automatic SSL certificates for HTTPS.

## 🧪 Testing Deployment

After deployment, verify these features:
1. Homepage loads correctly
2. User registration/login works
3. Product catalog displays
4. Shopping cart functionality
5. Admin dashboard (if admin user exists)
6. Email notifications (test with a small order)

## 🔍 Troubleshooting

### Common Issues:

**Build Failures:**
- Check Node.js version (should be 18+)
- Verify all environment variables are set
- Check build logs for missing dependencies

**Database Connection:**
- Ensure DATABASE_URL is correctly formatted
- Verify database is accessible from deployment platform
- Check for IP whitelist settings in Neon dashboard

**Authentication Issues:**
- Verify SESSION_SECRET is set
- Check REPLIT_ID matches your domain
- Ensure CORS settings allow your domain

### Performance Optimization:
- Enable Vercel Analytics for monitoring
- Use Netlify's performance features
- Monitor database connection pooling
- Set up CDN for static assets

## 📊 Monitoring

### Vercel:
- Built-in analytics and performance monitoring
- Function logs available in dashboard
- Real-time performance metrics

### Netlify:
- Deploy logs and build information
- Function logs and analytics
- Form handling and identity management

## 🔒 Security Checklist

- [ ] Environment variables are set correctly
- [ ] DATABASE_URL uses SSL connection
- [ ] SESSION_SECRET is strong and unique
- [ ] HTTPS is enabled (automatic on both platforms)
- [ ] Admin routes are properly protected
- [ ] Email credentials are secure

## 📈 Scaling Considerations

### Database:
- Neon PostgreSQL supports connection pooling
- Consider upgrading plan for higher traffic
- Monitor connection limits

### Application:
- Both platforms auto-scale serverless functions
- Consider edge caching for static assets
- Monitor function execution time limits

---

**Need Help?** 
- Check platform documentation: [Vercel Docs](https://vercel.com/docs) | [Netlify Docs](https://docs.netlify.com)
- Contact support: jabezmageto78@gmail.com