import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ArrowRight, ShoppingBag, Recycle, Wrench, Car, Shield, Battery, Award } from 'lucide-react';

const navTiles = [
  {
    title: 'Shop New',
    description: 'Latest models with full warranty',
    href: '/new',
    icon: ShoppingBag,
  },
  {
    title: 'Shop Used',
    description: 'Inspected pre-owned scooters',
    href: '/used',
    icon: Recycle,
  },
  {
    title: 'Certified Reborn™',
    description: 'Rebuilt. Tuned. Warrantied.',
    href: '/certified',
    icon: Award,
  },
  {
    title: 'Mod Lab',
    description: 'Customize your build',
    href: '/mod-lab',
    icon: Wrench,
  },
];

export default function Index() {
  return (
    <div className="h-screen bg-background overflow-hidden">
      <Navbar />

      <main className="h-full pt-16 flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8 flex flex-col">
          {/* Hero Section */}
          <div className="flex-1 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Certified Reborn.
                  <br />
                  <span className="text-gradient">New & Used</span>
                  <br />
                  E-Scooters.
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Buy new, buy used, or upgrade into a Reborn build—fully inspected, upgraded, and warrantied.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/used" className="btn-primary group">
                  Browse Certified Used
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/new" className="btn-secondary">
                  Shop New
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3">
                <span className="trust-badge">
                  <Shield className="w-4 h-4" />
                  Inspected
                </span>
                <span className="trust-badge">
                  <Wrench className="w-4 h-4" />
                  Upgraded
                </span>
                <span className="trust-badge">
                  <Award className="w-4 h-4" />
                  Warrantied
                </span>
              </div>
            </div>

            {/* Right: Hero Visual */}
            <div className="relative hidden lg:flex items-center justify-center">
              {/* Glow Effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
              </div>

              {/* Scooter Placeholder */}
              <div className="relative w-full max-w-md aspect-square">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full text-white/20"
                  fill="currentColor"
                >
                  <ellipse cx="100" cy="170" rx="60" ry="15" opacity="0.3" />
                  <rect x="40" y="80" width="120" height="8" rx="4" />
                  <rect x="30" y="76" width="16" height="16" rx="8" />
                  <circle cx="50" cy="140" r="30" fill="none" stroke="currentColor" strokeWidth="6" />
                  <circle cx="150" cy="140" r="30" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="140" y="70" width="24" height="50" rx="4" />
                  <rect x="70" y="40" width="12" height="40" rx="4" transform="rotate(-15 76 60)" />
                </svg>

                {/* Floating Pills */}
                <div className="floating-pill top-8 right-0 animate-float" style={{ animationDelay: '0s' }}>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-white text-sm font-medium">Reborn Score</span>
                  </div>
                </div>

                <div className="floating-pill top-1/3 -left-4 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm font-medium">Battery Health</span>
                  </div>
                </div>

                <div className="floating-pill bottom-1/4 right-4 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm font-medium">Warranty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-6 lg:mt-8">
            {navTiles.map((tile) => (
              <Link key={tile.href} to={tile.href} className="nav-tile group">
                <div>
                  <tile.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                    {tile.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                    {tile.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
