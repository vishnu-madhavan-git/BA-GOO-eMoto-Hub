import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { MapPin, Navigation, Trophy, User, Plus } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  distance: number;
  city: string;
  points: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'ScooterKing_DXB', distance: 2450, city: 'Dubai', points: 4900 },
  { rank: 2, username: 'GreenRider88', distance: 2120, city: 'Abu Dhabi', points: 4240 },
  { rank: 3, username: 'NightOwl_SHJ', distance: 1890, city: 'Sharjah', points: 3780 },
  { rank: 4, username: 'MaxSpeed_UAE', distance: 1650, city: 'Dubai', points: 3300 },
  { rank: 5, username: 'EcoCommuter', distance: 1420, city: 'Dubai', points: 2840 },
  { rank: 6, username: 'Marina_Rider', distance: 1380, city: 'Dubai', points: 2760 },
  { rank: 7, username: 'DesertScoot', distance: 1250, city: 'Abu Dhabi', points: 2500 },
  { rank: 8, username: 'JBR_Explorer', distance: 1100, city: 'Dubai', points: 2200 },
];

export default function RoutesPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showRouteResult, setShowRouteResult] = useState(false);

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      setShowRouteResult(true);
    }
  };

  const mockDistance = Math.floor(Math.random() * 15 + 5); // 5-20 km
  const mockPoints = mockDistance * 2;

  return (
    <div className="page-container">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="section-header mb-2">Community Routes</h1>
            <p className="section-subheader">
              Track your rides, discover new routes, and compete with other riders
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Create Route */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                Create a Route
              </h2>

              {/* Map Placeholder */}
              <div className="aspect-video bg-secondary rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full" />
                  <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary rounded-full" />
                  <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-primary rounded-full" />
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <path
                      d="M 25 25 Q 40 30 50 50 T 75 75"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-white/20"
                    />
                  </svg>
                </div>
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Map integration coming soon</p>
                </div>
              </div>

              <form onSubmit={handleCreateRoute} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Origin</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Starting point"
                      className="form-input pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="End point"
                      className="form-input pl-10"
                      required
                    />
                  </div>
                </div>

                {showRouteResult && (
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Distance</p>
                        <p className="text-2xl font-bold text-white">{mockDistance} km</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Points Earned</p>
                        <p className="text-2xl font-bold text-primary">+{mockPoints}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn-primary w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {showRouteResult ? 'Submit Route' : 'Calculate Route'}
                </button>
              </form>
            </div>

            {/* Leaderboard */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Monthly Leaderboard
              </h2>

              <div className="space-y-3">
                {mockLeaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                      entry.rank <= 3 ? 'bg-primary/10' : 'bg-secondary/50 hover:bg-secondary'
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      entry.rank === 1 ? 'bg-yellow-500 text-black' :
                      entry.rank === 2 ? 'bg-gray-400 text-black' :
                      entry.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {entry.rank}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{entry.username}</p>
                      <p className="text-xs text-muted-foreground">{entry.city}</p>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <p className="font-semibold text-white">{entry.distance.toLocaleString()} km</p>
                      <p className="text-xs text-primary">{entry.points.toLocaleString()} pts</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Earn 2 points per kilometer traveled
                </p>
                <p className="text-xs text-muted-foreground">
                  Top riders win monthly prizes!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
