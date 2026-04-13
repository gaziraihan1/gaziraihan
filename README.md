# 👨‍ Mohammad Raihan Gazi - Portfolio Website

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-green?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> A modern, performant, and fully-featured portfolio website built with Next.js 16, TypeScript, Prisma, and Tailwind CSS. Features a complete admin panel for content management.

---

## ✨ Features

### 🎨 Public Website
- **Hero Section** - Eye-catching introduction with animations
- **Projects Showcase** - Filterable project gallery with live demos
- **Blog System** - Markdown-based blog with tags and search
- **Uses Page** - Detailed breakdown of tools, hardware, and software
- **Contact Form** - Functional contact form with email notifications
- **Dark Theme** - Beautiful dark mode design throughout
- **Responsive Design** - Mobile-first, works on all devices
- **SEO Optimized** - Meta tags, Open Graph, and sitemap
- **Performance** - 95+ Lighthouse score

### 🔐 Admin Panel
- **Authentication** - Secure login with NextAuth v5
- **Dashboard** - Overview with stats and recent activity
- **Project Management** - CRUD operations for portfolio projects
- **Blog Management** - Write and publish blog posts with Markdown
- **Messages** - View and manage contact form submissions
- **Uses Management** - Manage hardware, software, and skills
- **Settings** - Profile, site config, and SEO settings
- **Role-Based Access** - Admin-only protected routes

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | PostgreSQL (Neon/Supabase) |
| **ORM** | Prisma |
| **Auth** | NextAuth.js v5 (Auth.js) |
| **Forms** | React Hook Form + Zod |
| **Animations** | Framer Motion |
| **Icons** | Lucide React + React Icons |
| **Deployment** | Vercel |
| **Email** | Resend / Nodemailer |

---

## 📦 Installation

### Prerequisites
- Node.js 20+ 
- PostgreSQL database
- Git

### Clone & Install
```bash
# Clone the repository
git clone https://github.com/gaziraihan1/gaziraihan.git
cd gaziraihan

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### Environment Variables
Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/dbname"

# Authentication
NEXTAUTH_SECRET="your-32-character-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# GitHub (for GitHub Stats)
GITHUB_USERNAME="gaziraihan1"
GITHUB_TOKEN="ghp_your_token_here"

# Email (optional)
RESEND_API_KEY="your-resend-api-key"
CONTACT_EMAIL="your-email@example.com"

```

> 🔐 **Generate NEXTAUTH_SECRET**: Run `openssl rand -base64 32` in terminal

---

## 🚀 Getting Started

### Development
```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build & Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Database Commands
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database (if seed file exists)
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

---

## 📁 Project Structure

```
my-portfolio/
├── app/
│   ├── (public)/              # Public pages
│   │   ├── page.tsx           # Homepage
│   │   ├── projects/          # Projects page
│   │   ├── blog/              # Blog pages
│   │   ├── uses/              # Uses page
│   │   └── contact/           # Contact page
│   ├── (admin)/               # Admin panel (protected)
│   │   └── admin/
│   │       ├── page.tsx       # Dashboard
│   │       ├── projects/      # Project management
│   │       ├── blog/          # Blog management
│   │       ├── messages/      # Messages
│   │       ├── uses/          # Uses management
│   │       └── settings/      # Settings
│   ├── api/                   # API routes
│   │   ├── auth/              # NextAuth endpoints
│   │   └── github-stats/      # GitHub stats API
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── features/              # Feature components
│   ├── admin/                 # Admin components
│   └── animations/            # Animation components
├── lib/
│   ├── prisma.ts              # Prisma client
│   ├── auth.ts                # NextAuth config
│   ├── cache.ts               # Caching utility
│   └── validation/            # Zod schemas
├── actions/                   # Server actions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── public/                    # Static assets
└── config/                    # Site configuration
```

---

## 🔐 Admin Access

### Create First Admin User
```bash
# After deploying, create admin via Prisma Studio:
npx prisma studio

# Or via SQL:
INSERT INTO "User" (id, email, password, name, role)
VALUES (
  'uuid-here',
  'admin@example.com',
  '$2a$10$hashed-password-here',
  'Admin Name',
  'ADMIN'
);
```

> 🔑 **Hash password**: Use bcrypt to hash passwords before inserting

### Default Admin Routes
| Route | Description |
| :--- | :--- |
| `/admin` | Dashboard overview |
| `/admin/projects` | Manage projects |
| `/admin/blog` | Manage blog posts |
| `/admin/messages` | View contact messages |
| `/admin/uses/hardware & /admin/uses/software` | Manage uses page content |
| `/admin/settings` | Site & profile settings |

---

## 🎨 Customization

### Update Site Config
Edit `config/site.ts`:
```typescript
export const siteConfig = {
  name: "Raihan Portfolio",
  title: "Full Stack Developer",
  description: "Building amazing web experiences...",
  url: "https://yourdomain.com",
  ogImage: "https://yourdomain.com/og.jpg",
  // ... more config
};
```

### Update Theme Colors
Edit `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      // Customize your color palette
      primary: { /* ... */ },
      accent: { /* ... */ },
    },
  },
}
```

### Add Your Content
1. **Projects**: Admin → Projects → Create New
2. **Blog Posts**: Admin → Blog → Create New
3. **Skills**: Admin → Uses → Skills → Add
4. **Hardware/Software**: Admin → Uses → Hardware/Software

---

## 📊 Performance

| Metric | Score |
| :--- | :--- |
| **Performance** | 95+ |
| **Accessibility** | 100 |
| **Best Practices** | 100 |
| **SEO** | 100 |

### Optimization Features
- ✅ Static generation with ISR
- ✅ Image optimization with Next.js Image
- ✅ Font optimization with next/font
- ✅ Code splitting & lazy loading
- ✅ Server-side rendering for SEO
- ✅ Efficient database queries (no N+1)
- ✅ In-memory caching for frequently accessed data

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Set up Database**
   - Use [Neon](https://neon.tech) or [Supabase](https://supabase.com)
   - Add `DATABASE_URL` to Vercel environment variables

4. **Configure Domain** (Optional)
   - Add custom domain in Vercel settings
   - Update `NEXTAUTH_URL` environment variable

### Environment Variables for Production
```bash
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"
DATABASE_URL="postgresql://..."
GITHUB_USERNAME="gaziraihan1"
GITHUB_TOKEN="ghp_..."
```

---

##  Testing

```bash
# Run TypeScript type checking
npm run type-check

# Run ESLint
npm run lint

# Build for production
npm run build

# Run Lighthouse audit
npm run lighthouse
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Mohammad Raihan Gazi**

- 🌐 Portfolio: [https://gaziraihan.vercel.app](https://gaziraihan.vercel.app)
- 📧 Email: gazyraihan3@gmail.com
- 💼 LinkedIn: [linkedin.com/in/gaziraihan](https://linkedin.com/in/mohammad-raihan-gazi)
- 🐙 GitHub: [github.com/gaziraihan1](https://github.com/gaziraihan1)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://prisma.io/) - Next-generation ORM
- [Vercel](https://vercel.com/) - Deployment platform
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

## 📈 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/gaziraihan1/my-portfolio?style=for-the-badge)
![GitHub Forks](https://img.shields.io/github/forks/gaziraihan1/my-portfolio?style=for-the-badge)
![GitHub Issues](https://img.shields.io/github/issues/gaziraihan1/my-portfolio?style=for-the-badge)
![GitHub Last Commit](https://img.shields.io/github/last-commit/gaziraihan1/my-portfolio?style=for-the-badge)

---

<div align="center">

### ⭐ If you like this project, please give it a star!

**Built with ❤️ by Mohammad Raihan Gazi**

</div>
