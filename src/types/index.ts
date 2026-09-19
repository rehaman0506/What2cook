export type FoodType = 'VEGETARIAN' | 'NON-VEGETARIAN';

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'సులువు' | 'మధ్యస్థం' | 'కష్టం' | 'आसान' | 'मध्यम' | 'कठिन' | (string & {});

export interface RecipeIngredient {
  name: string;
  quantity: string;
  isOptional?: boolean;
}

export interface RecipeInstruction {
  step: number;
  text: string;
}

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image_url: string;
  cuisine: string;
  category: string;
  food_type: FoodType;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  preparation_time: string;
  cooking_time: string;
  total_time: string;
  difficulty: Difficulty;
  servings: number;
  rating: number;
  tips?: string[];
  nutrition?: NutritionInfo;
  created_at?: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  iconName: string;
  tag: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'chef';
  text?: string;
  recipe?: Recipe;
  userIngredients?: string[];
  additionalIngredients?: string[];
  timestamp: string;
  isDisclaimer?: boolean;
}

export interface RecipeFilterState {
  searchQuery: string;
  foodType: 'ALL' | 'VEGETARIAN' | 'NON-VEGETARIAN';
  cuisine: string;
  category: string;
  maxCookTime: number | null; // minutes
  difficulty: 'ALL' | 'Easy' | 'Medium' | 'Hard';
  sortBy: 'popular' | 'quickest' | 'easy' | 'recent';
}

export interface UserProfile {
  id: string;
  email: string;
  created_at?: string;
  isGuest?: boolean;
}
