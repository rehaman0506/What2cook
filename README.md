# What2Cook 👨‍🍳🥗

> **Turn Your Ingredients Into Delicious Recipes**  
> *Tell our AI what you have in your kitchen and discover what you can cook.*

What2Cook is a modern, responsive, student-friendly AI-powered Food & Recipe platform featuring an intelligent conversational AI Chef, searchable recipe catalog, categorized browsing, interactive step-by-step preparation checklists, and user authentication with saved favorites.

---

## ✨ Features

- **Conversational AI Chef**: ChatGPT-style natural language interface with suggested questions and structured recipe output.
- **Smart Ingredient Matching**: Prioritizes ingredients you have at home while clearly separating *Optional / Additional ingredients*.
- **Comprehensive Recipe Catalog**: Multi-attribute search across dish names, ingredients, cuisines, and food categories.
- **Dietary Tagging**: Explicit **VEGETARIAN** and **NON-VEGETARIAN** classification badges.
- **Interactive Recipe Details**:
  - Full preparation checklists with interactive checkboxes.
  - Numbered step-by-step instructions.
  - Chef secret tips and nutrition facts (Calories, Protein, Carbs, Fat).
  - Print and share recipe capabilities.
- **Supabase Backend**: Complete database schema with Row Level Security (RLS) for recipes and user favorites, with automatic offline resilience.
- **Responsive UI/UX**: Designed for mobile, tablet, and desktop screens with Tailwind CSS and Lucide React.
- **Vercel Ready**: Preconfigured with `vercel.json` for client-side routing.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend / Database**: Supabase (`@supabase/supabase-js`)
- **AI Integration**: Google Gemini API (with built-in intelligent fallback engine)
- **Deployment**: Vercel

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd what2cook
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables (Optional)
Create a `.env` file from `.env.example`:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
```
*(Note: What2Cook runs completely offline in demo mode if keys are not provided!)*

### 4. Start the development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 🗄️ Database Setup (Supabase)

If using Supabase, navigate to the Supabase SQL Editor and execute the script in `supabase_schema.sql` to generate:
- `recipes` table with check constraints and indexes.
- `favorites` table with cascade delete on user removal.
- Row Level Security (RLS) policies.
- 12 initial signature seed recipes.

---

## 📜 Recipe Disclaimer
> *Recipes are AI-generated suggestions. Please verify ingredients, cooking times, and cooking methods before preparing. Always consider food allergies, dietary restrictions, and personal health requirements.*
