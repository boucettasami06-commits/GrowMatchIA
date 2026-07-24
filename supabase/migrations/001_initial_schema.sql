-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Programs table (beauty goals/objectives)
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_type VARCHAR(50) NOT NULL CHECK (program_type IN ('anti-acne', 'glow', 'anti-age', 'hair')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, program_type) -- One active program per type per user
);

-- Questionnaires table (user responses for each program)
CREATE TABLE questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,

  -- Profile
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 100),
  country VARCHAR(100),

  -- Skin
  skin_type VARCHAR(50) NOT NULL CHECK (skin_type IN ('dry', 'mixed', 'oily', 'sensitive')),
  main_concern VARCHAR(100) NOT NULL,
  allergies TEXT[], -- Array of allergy strings

  -- Routine preferences
  budget_monthly INTEGER NOT NULL CHECK (budget_monthly > 0),
  preferred_brands TEXT[], -- Array of brand names
  time_available_minutes INTEGER NOT NULL CHECK (time_available_minutes > 0),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Routines table (generated skincare routines)
CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Timeline expectations
  expected_results_weeks INTEGER DEFAULT 8 CHECK (expected_results_weeks > 0),

  -- Totals
  total_time_morning_minutes INTEGER,
  total_time_evening_minutes INTEGER
);

-- Routine steps (individual steps in a routine)
CREATE TABLE routine_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,

  -- Step info
  step_type VARCHAR(50) NOT NULL CHECK (step_type IN ('morning', 'evening', 'bonus')),
  step_number INTEGER NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_category VARCHAR(100),
  time_minutes INTEGER,
  instructions TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_programs_user_id ON programs(user_id);
CREATE INDEX idx_programs_user_type ON programs(user_id, program_type);
CREATE INDEX idx_questionnaires_program_id ON questionnaires(program_id);
CREATE INDEX idx_routines_program_id ON routines(program_id);
CREATE INDEX idx_routine_steps_routine_id ON routine_steps(routine_id);
CREATE INDEX idx_routine_steps_type ON routine_steps(step_type);

-- Enable RLS (Row Level Security)
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_steps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for programs
CREATE POLICY "Users can view their own programs"
  ON programs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create programs"
  ON programs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own programs"
  ON programs FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for questionnaires (via program)
CREATE POLICY "Users can view questionnaires of their programs"
  ON questionnaires FOR SELECT
  USING (
    program_id IN (
      SELECT id FROM programs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create questionnaires for their programs"
  ON questionnaires FOR INSERT
  WITH CHECK (
    program_id IN (
      SELECT id FROM programs WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for routines (via program)
CREATE POLICY "Users can view routines of their programs"
  ON routines FOR SELECT
  USING (
    program_id IN (
      SELECT id FROM programs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create routines for their programs"
  ON routines FOR INSERT
  WITH CHECK (
    program_id IN (
      SELECT id FROM programs WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for routine_steps (via routine -> program)
CREATE POLICY "Users can view routine steps"
  ON routine_steps FOR SELECT
  USING (
    routine_id IN (
      SELECT r.id FROM routines r
      JOIN programs p ON r.program_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Coach messages table (AI coaching feedback)
CREATE TABLE coach_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Message content
  user_message TEXT, -- User's question or request (optional)
  coach_message TEXT NOT NULL, -- AI coach's response

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for coach messages
CREATE INDEX idx_coach_messages_program_id ON coach_messages(program_id);
CREATE INDEX idx_coach_messages_user_id ON coach_messages(user_id);
CREATE INDEX idx_coach_messages_created_at ON coach_messages(created_at DESC);

-- Enable RLS for coach_messages
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coach_messages
CREATE POLICY "Users can view coach messages for their programs"
  ON coach_messages FOR SELECT
  USING (
    program_id IN (
      SELECT id FROM programs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create coach messages for their programs"
  ON coach_messages FOR INSERT
  WITH CHECK (
    program_id IN (
      SELECT id FROM programs WHERE user_id = auth.uid()
    )
    AND user_id = auth.uid()
  );
