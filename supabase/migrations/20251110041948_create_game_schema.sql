/*
  # Professional Development Game Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text)
      - `total_score` (integer, default 0)
      - `current_level` (integer, default 1)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `competencies`
      - `id` (uuid, primary key)
      - `name` (text) - e.g., "Liderazgo", "Análisis", "Comunicación"
      - `description` (text)
      - `icon` (text)
      - `color` (text)
    
    - `questions`
      - `id` (uuid, primary key)
      - `competency_id` (uuid, references competencies)
      - `level` (integer) - difficulty level 1-5
      - `type` (text) - "pattern", "sequence", "analogy", "logic"
      - `question_text` (text)
      - `visual_data` (jsonb) - stores visual elements configuration
      - `options` (jsonb) - array of answer options
      - `correct_answer` (integer) - index of correct option
      - `explanation` (text)
      - `points` (integer)
    
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `question_id` (uuid, references questions)
      - `is_correct` (boolean)
      - `attempts` (integer, default 1)
      - `completed_at` (timestamptz)
    
    - `achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `competency_id` (uuid, references competencies)
      - `level_completed` (integer)
      - `unlocked_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to manage their own data
    - Public read access to competencies and questions
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text,
  total_score integer DEFAULT 0,
  current_level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS competencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL
);

ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view competencies"
  ON competencies FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_id uuid REFERENCES competencies ON DELETE CASCADE,
  level integer NOT NULL,
  type text NOT NULL,
  question_text text NOT NULL,
  visual_data jsonb,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  explanation text,
  points integer DEFAULT 10
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  question_id uuid REFERENCES questions ON DELETE CASCADE,
  is_correct boolean NOT NULL,
  attempts integer DEFAULT 1,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  competency_id uuid REFERENCES competencies ON DELETE CASCADE,
  level_completed integer NOT NULL,
  unlocked_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

INSERT INTO competencies (name, description, icon, color) VALUES
  ('Liderazgo', 'Capacidad de guiar y motivar equipos hacia objetivos comunes', 'users', '#3B82F6'),
  ('Análisis', 'Habilidad para examinar información y resolver problemas complejos', 'brain', '#10B981'),
  ('Comunicación', 'Efectividad en transmitir ideas y colaborar con otros', 'message-circle', '#F59E0B'),
  ('Creatividad', 'Capacidad de generar ideas innovadoras y soluciones originales', 'lightbulb', '#8B5CF6'),
  ('Toma de Decisiones', 'Habilidad para evaluar opciones y elegir la mejor alternativa', 'target', '#EF4444');

INSERT INTO questions (competency_id, level, type, question_text, visual_data, options, correct_answer, explanation, points) VALUES
  (
    (SELECT id FROM competencies WHERE name = 'Análisis' LIMIT 1),
    1,
    'pattern',
    '¿Qué figura completa el patrón?',
    '{"pattern": ["circle", "square", "circle", "square", "circle", "?"], "colors": ["blue", "red", "blue", "red", "blue", "?"]}',
    '["square", "circle", "triangle", "pentagon"]',
    0,
    'El patrón alterna círculo y cuadrado, por lo tanto el siguiente debe ser un cuadrado.',
    10
  ),
  (
    (SELECT id FROM competencies WHERE name = 'Liderazgo' LIMIT 1),
    1,
    'logic',
    'Un líder efectivo debe: ¿Qué combinación de habilidades es más importante?',
    '{}',
    '["Solo dar órdenes", "Escuchar y guiar", "Imponer sin consultar", "Evitar conflictos siempre"]',
    1,
    'Un líder efectivo equilibra la escucha activa con la capacidad de guiar al equipo hacia objetivos claros.',
    10
  ),
  (
    (SELECT id FROM competencies WHERE name = 'Análisis' LIMIT 1),
    2,
    'sequence',
    '¿Qué número completa la secuencia? 2, 4, 8, 16, ?',
    '{"sequence": [2, 4, 8, 16], "type": "geometric"}',
    '["24", "32", "20", "18"]',
    1,
    'Cada número es el doble del anterior: 2×2=4, 4×2=8, 8×2=16, 16×2=32',
    15
  ),
  (
    (SELECT id FROM competencies WHERE name = 'Comunicación' LIMIT 1),
    1,
    'logic',
    'En una reunión, un colega interrumpe constantemente. ¿Cuál es la mejor estrategia?',
    '{}',
    '["Ignorarlo completamente", "Establecer turnos de palabra respetuosamente", "Interrumpir de vuelta", "Abandonar la reunión"]',
    1,
    'La comunicación efectiva requiere establecer normas claras y respetuosas para todos los participantes.',
    10
  ),
  (
    (SELECT id FROM competencies WHERE name = 'Creatividad' LIMIT 1),
    2,
    'analogy',
    'Pincel es a pintura como teclado es a...',
    '{"items": ["brush-paint", "keyboard-?"]}',
    '["ratón", "texto", "pantalla", "cable"]',
    1,
    'El pincel crea pintura; el teclado crea texto. Ambos son herramientas que generan un producto.',
    15
  ),
  (
    (SELECT id FROM competencies WHERE name = 'Toma de Decisiones' LIMIT 1),
    2,
    'logic',
    'Tienes 3 proyectos urgentes y solo tiempo para 2. ¿Cómo decides?',
    '{}',
    '["Elegir al azar", "Analizar impacto y recursos de cada uno", "Hacer los más fáciles", "Pedir a alguien más que decida"]',
    1,
    'Las decisiones efectivas requieren análisis de impacto, recursos disponibles y priorización estratégica.',
    15
  );
