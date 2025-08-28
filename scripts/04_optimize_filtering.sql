-- Simplified SQL script for Supabase compatibility
-- Create indexes for optimized filtering (removed computed columns as they may not be supported)

-- Create basic indexes for existing columns
CREATE INDEX IF NOT EXISTS idx_matches_home_team 
ON public.matches (home_team);

CREATE INDEX IF NOT EXISTS idx_matches_away_team 
ON public.matches (away_team);

CREATE INDEX IF NOT EXISTS idx_matches_league 
ON public.matches (league);

CREATE INDEX IF NOT EXISTS idx_matches_season 
ON public.matches (season);

-- Create composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_matches_teams 
ON public.matches (home_team, away_team);

CREATE INDEX IF NOT EXISTS idx_matches_goals 
ON public.matches (full_time_home_goals, full_time_away_goals);

-- Create index for half-time goals for comeback calculations
CREATE INDEX IF NOT EXISTS idx_matches_half_time_goals 
ON public.matches (half_time_home_goals, half_time_away_goals);

-- Update statistics for better query planning
ANALYZE public.matches;
