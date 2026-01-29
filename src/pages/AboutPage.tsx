import { Navbar } from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Award, Shield, Wrench, Users, MapPin, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="page-container">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The UAE's Premier
              <br />
              <span className="text-gradient">E-Scooter Destination</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              BAAGOO brings the automotive tuning house philosophy to electric mobility. 
              Every scooter we touch is built to exceed expectations.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="glass-card p-6">
              <Award className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Certified Reborn™</h3>
              <p className="text-muted-foreground">
                Our signature program takes pre-owned scooters through a comprehensive 7-step 
                rebuild process. The result? Performance that rivals—or exceeds—factory new.
              </p>
            </div>
            <div className="glass-card p-6">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Warranty Backed</h3>
              <p className="text-muted-foreground">
                Every Certified Reborn™ unit comes with a 12-month warranty and documented 
                build sheet. We stand behind our work.
              </p>
            </div>
            <div className="glass-card p-6">
              <Wrench className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Expert Service</h3>
              <p className="text-muted-foreground">
                Our technicians are trained on all major brands. From basic tune-ups to 
                full rebuilds, we've got you covered.
              </p>
            </div>
            <div className="glass-card p-6">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Community First</h3>
              <p className="text-muted-foreground">
                Join our growing community of riders across the UAE. Track routes, 
                earn points, and connect with fellow enthusiasts.
              </p>
            </div>
          </div>

          {/* Locations */}
          <div className="glass-card p-8 text-center mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Visit Us</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-white">Dubai</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-white">Abu Dhabi</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-white">Sharjah</span>
              </div>
            </div>
            <p className="text-muted-foreground mt-4 text-sm">
              More locations coming soon across the GCC
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Ride?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/new" className="btn-primary group">
                Shop New
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/certified" className="btn-secondary">
                Explore Certified Reborn™
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
