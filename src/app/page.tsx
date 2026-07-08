import Hero from '@/components/home/Hero';
import LatestMatch from '@/components/home/LatestMatch';
import UpcomingMatch from '@/components/home/UpcomingMatch';
import TeamStats from '@/components/home/TeamStats';
import RecentResults from '@/components/home/RecentResults';
import Sponsors from '@/components/home/Sponsors';
import InstagramSection from '@/components/home/InstagramSection';
import { computeTeamStats } from '@/lib/stats';
import matchesData from '@/data/matches.json';
import upcomingData from '@/data/upcoming.json';
import type { Match, UpcomingMatch as IUpcomingMatch } from '@/lib/types';

export default function HomePage() {
  const matches = matchesData as Match[];
  const upcoming = upcomingData as IUpcomingMatch;
  const sorted = [...matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const stats = computeTeamStats(matches);

  return (
    <>
      <Hero />
      <LatestMatch match={sorted[0]} />
      <UpcomingMatch match={upcoming} />
      <TeamStats stats={stats} />
      <RecentResults matches={sorted} />
      <Sponsors />
      <InstagramSection />
    </>
  );
}
