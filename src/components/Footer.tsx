import React from 'react';
import { ChefHat, Heart, ShieldAlert, Sparkles } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'recipes' | 'categories' | 'chatbot') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mandatory Safety Disclaimer Banner */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm leading-relaxed">
            <strong className="text-amber-300 font-semibold">Recipe Disclaimer: </strong>
            Recipes are AI-generated suggestions. Please verify ingredients, cooking times, and cooking methods before preparing. Always consider food allergies, dietary restrictions, and personal health requirements.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <ChefHat className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                What2Cook <span className="text-orange-500 text-sm font-bold bg-orange-500/20 px-1.5 py-0.5 rounded">AI</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Transform your fridge ingredients into chef-quality meals in seconds. Student-friendly, zero food waste, and delightfully fast.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Powered by Intelligent Culinary AI & Supabase</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Home Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('recipes'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-orange-400 transition-colors"
                >
                  All Recipes & Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('categories'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Cuisine & Meal Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('chatbot'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-orange-400 transition-colors"
                >
                  AI Chef Chatbot
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Cuisines */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Top Cuisines</h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>South Indian (Dosa, Biryani, Vada)</li>
              <li>North Indian (Paneer Butter, Butter Chicken)</li>
              <li>Italian (Penne Arrabbiata, Pizza)</li>
              <li>Mexican (Street Tacos, Burritos)</li>
              <li>Asian & Indo-Chinese Stir Fry</li>
            </ul>
          </div>

          {/* Student Demonstration Info */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Project Info</h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              CSE Academic Project Demonstration. Built with React, Tailwind CSS, Supabase Database & Auth, and AI Recipe Generation.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Vercel Deployment Ready
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} What2Cook AI. Designed with modern web standards.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for hungry students & food lovers
          </p>
        </div>
      </div>
    </footer>
  );
};
