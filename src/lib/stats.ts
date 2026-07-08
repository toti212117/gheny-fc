import { Match, TeamStats, PlayerStats } from './types';

export function computeTeamStats(matches: Match[]): TeamStats {
  const played = matches.length;
  const wins = matches.filter(m => m.result === 'W').length;
  const draws = matches.filter(m => m.result === 'D').length;
  const losses = matches.filter(m => m.result === 'L').length;
  const goalsFor = matches.reduce((s, m) => s + m.goalsFor, 0);
  const goalsAgainst = matches.reduce((s, m) => s + m.goalsAgainst, 0);
  const points = wins * 3 + draws;

  return {
    played,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    points,
    winPercentage: played > 0 ? Math.round((wins / played) * 100) : 0,
  };
}

export function computePlayerStats(matches: Match[]): PlayerStats[] {
  // Key by name because scraped players all have playerId 0
  const map = new Map<string, PlayerStats>();

  const ensure = (name: string) => {
    const key = name.toLowerCase().trim();
    if (!map.has(key)) {
      map.set(key, { playerId: 0, name, goals: 0, assists: 0, appearances: 0, yellowCards: 0, redCards: 0 });
    }
    return map.get(key)!;
  };

  for (const match of matches) {
    const seen = new Set<string>();

    for (const g of match.goalScorers) {
      ensure(g.name).goals++;
      seen.add(g.name.toLowerCase().trim());
    }
    for (const a of match.assists) {
      ensure(a.name).assists++;
      seen.add(a.name.toLowerCase().trim());
    }
    for (const y of match.yellowCards) {
      ensure(y.name).yellowCards++;
      seen.add(y.name.toLowerCase().trim());
    }
    for (const r of match.redCards) {
      ensure(r.name).redCards++;
      seen.add(r.name.toLowerCase().trim());
    }

    for (const key of seen) {
      map.get(key)!.appearances++;
    }
  }

  return Array.from(map.values()).sort((a, b) => b.goals - a.goals || b.assists - a.assists);
}

export function getCurrentStreak(matches: Match[]): string {
  if (matches.length === 0) return 'N/A';
  const sorted = [...matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const first = sorted[0].result;
  let count = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].result === first) count++;
    else break;
  }
  const label = first === 'W' ? 'W' : first === 'D' ? 'D' : 'L';
  return `${count}${label}`;
}
