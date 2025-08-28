-- Drop existing view if it exists
DROP VIEW IF EXISTS team_form_analysis;

-- Create corrected team_form_analysis view
CREATE VIEW team_form_analysis AS
SELECT 
  ts.team_name,
  COUNT(*) AS total_matches,
  AVG(ts.goals_scored) AS avg_goals_scored,
  AVG(ts.goals_conceded) AS avg_goals_conceded,
  COUNT(*) FILTER (WHERE ts.btts) * 100.0 / COUNT(*) AS btts_percentage,
  STDDEV(CASE WHEN ts.btts THEN 1.0 ELSE 0.0 END) AS btts_std_dev,
  -- Confidence interval calculations (corrected formula)
  (COUNT(*) FILTER (WHERE ts.btts) * 100.0 / COUNT(*)) -
    1.96 * SQRT(
      (COUNT(*) FILTER (WHERE ts.btts) * 100.0 / COUNT(*)) *
      (100 - (COUNT(*) FILTER (WHERE ts.btts) * 100.0 / COUNT(*))) /
      COUNT(*)
    ) AS btts_lower_ci,
  (COUNT(*) FILTER (WHERE ts.btts) * 100.0 / COUNT(*)) +
    1.96 * SQRT(
      (COUNT(*) FILTER (WHERE ts.btts) * 100.0 / COUNT(*)) *
      (100 - (COUNT(*) FILTER (WHERE ts.btts) * 100.0 / COUNT(*))) /
      COUNT(*)
    ) AS btts_upper_ci
FROM (
  SELECT 
    home_team AS team_name,
    full_time_home_goals AS goals_scored,
    full_time_away_goals AS goals_conceded,
    (full_time_home_goals > 0 AND full_time_away_goals > 0) AS btts
  FROM matches
  UNION ALL
  SELECT 
    away_team AS team_name,
    full_time_away_goals AS goals_scored,
    full_time_home_goals AS goals_conceded,
    (full_time_home_goals > 0 AND full_time_away_goals > 0) AS btts
  FROM matches
) ts  -- Added missing subquery alias
GROUP BY ts.team_name
HAVING COUNT(*) >= 5;  -- Minimum 5 matches for reliable statistics
