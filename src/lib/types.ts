export interface Player {
  id: number;
  name: string;
  number: number | null;
  highestLevel: string;
  snapchat: string | null;
  photo: string | null;
  position: string;
}

export interface GoalEvent {
  playerId: number;
  name: string;
  minute: number;
}

export interface CardEvent {
  playerId: number;
  name: string;
  minute: number;
}

export type MatchResult = 'W' | 'D' | 'L';

export interface Match {
  id: string;
  date: string;
  kickoffTime: string;
  opponent: string;
  homeAway: 'Home' | 'Away';
  venue: string;
  competition: string;
  goalsFor: number;
  goalsAgainst: number;
  result: MatchResult;
  goalScorers: GoalEvent[];
  assists: GoalEvent[];
  yellowCards: CardEvent[];
  redCards: CardEvent[];
  notes: string;
}

export interface UpcomingMatch {
  date: string;
  kickoffTime: string;
  opponent: string;
  homeAway: 'Home' | 'Away';
  venue: string;
  competition?: string;
}

export interface TeamStats {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  winPercentage: number;
}

export interface PlayerStats {
  playerId: number;
  name: string;
  goals: number;
  assists: number;
  appearances: number;
  yellowCards: number;
  redCards: number;
}
