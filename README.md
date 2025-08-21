# Visarut Sankham Portfolio Website

A modern portfolio website for วิศรุต แสนคำ (Visarut Sankham), a Thai media professional specializing in photography, videography, web development, graphic design, and creative services.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **UI Library**: Chakra UI v3
- **Language**: TypeScript
- **CMS**: WordPress Headless (REST API)
- **Styling**: Custom CSS with Thai font support
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   ├── portfolio/         # Portfolio pages
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/            # Reusable components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── portfolio/        # Portfolio-specific components
│   ├── ui/               # UI components
│   └── providers.tsx     # Chakra UI provider
├── lib/                  # Library code
│   ├── config.ts         # Site configuration
│   ├── theme.ts          # Chakra UI theme
│   └── wordpress.ts      # WordPress API client
├── types/                # TypeScript type definitions
│   ├── index.ts          # Common types
│   ├── portfolio.ts      # Portfolio-specific types
│   └── wordpress.ts      # WordPress API types
├── utils/                # Utility functions
│   └── index.ts          # Common utilities
└── hooks/                # Custom React hooks
```

## 🎨 Design Features

- **Thai Language Support**: Custom Kanit font for Thai text
- **Dark/Light Mode**: System preference with manual toggle
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, minimal design with smooth animations
- **Color Scheme**:
  - Primary: #1a1a1a
  - Secondary: #ffffff
  - Accent: #6b7280 (Apple-style gray)

## 📊 Portfolio Categories

The website supports the following portfolio categories:

1. **ภาพถ่าย** (Photography)
2. **ถ่ายวีดีโอ** (Videography)
3. **ตัดต่อวีดีโอ** (Video Editing)
4. **เว็บไซต์** (Website)
5. **ออกแบบกราฟิก** (Graphic Design)
6. **สิ่งพิมพ์** (Print)
7. **นิทรรศการ** (Exhibition)
8. **แคมเปญ** (Campaign)
9. **โปรดิวเซอร์** (Producer)

## 🔌 WordPress Integration

The website integrates with WordPress as a headless CMS:

- **Base URL**: `https://visarutsankham.com/wp-json/wp/v2/`
- **Portfolios Endpoint**: `/portfolios`
- **Categories Endpoint**: `/portfolio_category`
- **Media Support**: Images, videos, galleries
- **ACF Support**: Category-specific custom fields

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- WordPress site with REST API enabled

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Development Status

### Phase 1: Foundation ✅

- [x] Project setup and configuration
- [x] Basic layout components (Header, Footer)
- [x] Homepage with hero section
- [x] TypeScript types and API client
- [x] Chakra UI theme configuration

### Next Steps

- [ ] Portfolio grid component with filtering
- [ ] Individual portfolio item pages
- [ ] WordPress API integration
- [ ] Contact form
- [ ] About page

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📞 Contact

- **Email**: contact@visarutsankham.com
- **Website**: https://visarutsankham.com
