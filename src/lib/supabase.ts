import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Competency = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
};

export type Question = {
  id: string;
  competency_id: string;
  level: number;
  type: 'pattern' | 'sequence' | 'analogy' | 'logic';
  question_text: string;
  visual_data: any;
  options: string[];
  correct_answer: number;
  explanation: string;
  points: number;
};

export type Profile = {
  id: string;
  username: string | null;
  total_score: number;
  current_level: number;
  created_at: string;
  updated_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  question_id: string;
  is_correct: boolean;
  attempts: number;
  completed_at: string;
};

export type Achievement = {
  id: string;
  user_id: string;
  competency_id: string;
  level_completed: number;
  unlocked_at: string;
};
