# 🚀 GitHub & Vercel Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Repository name: `foot-life`
4. Description: "Jersey e-commerce store with Stripe payments"
5. Make it **Public** (for free Vercel deployment)
6. **Don't** initialize with README (we already have files)
7. Click "Create repository"

## Step 2: Connect to GitHub

```bash
# Add GitHub remote
git remote add origin https://github.com/BigBonny/foot-life.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Through Vercel Dashboard:

1. Go to [Vercel.com](https://vercel.com)
2. Click "Sign Up" or "Login"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub
5. Click "New Project"
6. Select `foot-life` repository
7. Click "Import"

### Configure Vercel Settings:

**Build Settings:**
- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Install Command**: `pnpm install`
- **Output Directory**: `.next`

**Environment Variables:**
You'll need to add these in Vercel dashboard:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key_here
STRIPE_SECRET_KEY=your_key_here
STRIPE_WEBHOOK_SECRET=your_webhook_secret_here

# Base URL (Vercel will set this automatically)
NEXT_PUBLIC_BASE_URL=https://foot-life.vercel.app
```

## Step 4: Deploy

1. Add all environment variables in Vercel dashboard
2. Click "Deploy"
3. Wait for deployment to complete
4. Your app will be live at: `https://foot-life.vercel.app`

## Step 5: Post-Deployment Setup

### Update Stripe Webhook:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Webhooks**
3. Add new webhook endpoint: `https://foot-life.vercel.app/api/stripe-webhook`
4. Select events: `checkout.session.completed`
5. Copy the new webhook secret
6. Update Vercel environment variables with new webhook secret

### Update Environment Variables:

```env
# Update this in Vercel settings
NEXT_PUBLIC_BASE_URL=https://foot-life.vercel.app
STRIPE_WEBHOOK_SECRET=your_new_webhook_secret
```

## Step 6: Test Production Deployment

1. Visit your deployed site
2. Test user registration/login
3. Add items to cart
4. Test checkout with Stripe test card: `4242 4242 4242 4242`
5. Verify order creation

## 🎯 Quick Commands Summary:

```bash
# Git setup
git remote add origin https://github.com/BigBonny/foot-life.git
git branch -M main
git push -u origin main

# Vercel deployment - use dashboard at vercel.com
```

## 🔐 Important Security Notes:

- Never commit `.env.local` to Git (already in .gitignore)
- Add environment variables in Vercel dashboard only
- Use production keys for live deployment
- Keep webhook secrets secure

**Your jersey store will be live on Vercel in minutes!** 🏆
