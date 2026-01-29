import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { getProductById } from '@/data/products';
import { 
  ArrowLeft, MessageCircle, Battery, Gauge, Zap, 
  MapPin, Shield, Award, Wrench, CheckCircle,
  FileText
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');

  if (!product) {
    return (
      <div className="page-container">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
            <Link to="/" className="text-primary hover:underline">
              Return to home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const gradeColors: Record<string, string> = {
    'A+': 'grade-a-plus',
    'A': 'grade-a',
    'B': 'grade-b',
    'C': 'grade-c',
  };

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in the ${product.name} (${product.id}) listed at AED ${product.price.toLocaleString()}`
  );

  return (
    <div className="page-container">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <Link
            to={product.type === 'new' ? '/new' : '/used'}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {product.type === 'new' ? 'New' : 'Used'} Scooters
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-card to-background flex items-center justify-center relative">
                <svg
                  viewBox="0 0 200 200"
                  className="w-48 h-48 text-white/20"
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

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {product.isCertified && (
                    <span className="spec-pill-primary">
                      <Award className="w-4 h-4" />
                      Certified Reborn™
                    </span>
                  )}
                  {product.type === 'used' && (
                    <span className={`grade-badge ${gradeColors[product.grade]}`}>
                      {product.grade}
                    </span>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              {product.isCertified && (
                <div className="flex flex-wrap gap-2">
                  <span className="trust-badge">
                    <Shield className="w-4 h-4" />
                    {product.warranty_months}mo Warranty
                  </span>
                  <span className="trust-badge">
                    <Wrench className="w-4 h-4" />
                    Spare Parts Ready
                  </span>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              <div>
                <p className="text-muted-foreground mb-1">{product.brand}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {product.city}
                  <span className="mx-2">•</span>
                  {product.year}
                </div>
              </div>

              <div className="text-4xl font-bold text-primary">
                AED {product.price.toLocaleString()}
              </div>

              <p className="text-muted-foreground">
                {product.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="glass-card p-4 text-center">
                  <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{product.range_km}</p>
                  <p className="text-xs text-muted-foreground">km range</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <Gauge className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{product.top_speed_kmh}</p>
                  <p className="text-xs text-muted-foreground">km/h top speed</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <Battery className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{product.battery_health_pct}%</p>
                  <p className="text-xs text-muted-foreground">battery health</p>
                </div>
              </div>

              {/* Used/Certified Extra Info */}
              {product.type === 'used' && (
                <div className="glass-card p-4">
                  <h3 className="font-semibold text-white mb-3">Condition Report</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Mileage</p>
                      <p className="text-white font-semibold">{product.mileage_km.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Reborn Score</p>
                      <p className="text-primary font-semibold">{product.reborn_score}/100</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Cosmetic Score</p>
                      <p className="text-white font-semibold">{product.cosmetic_score}/100</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Mechanical Score</p>
                      <p className="text-white font-semibold">{product.mechanical_score}/100</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Build Sheet Link (Certified only) */}
              {product.isCertified && (
                <Link
                  to={`/product/${product.id}/build-sheet`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <FileText className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-white">View Build Sheet</p>
                    <p className="text-xs text-muted-foreground">Detailed rebuild documentation</p>
                  </div>
                </Link>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="spec-pill">{tag}</span>
                ))}
              </div>

              {/* CTA */}
              <a
                href={`https://wa.me/971501234567?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn w-full justify-center py-4 text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp to Buy
              </a>

              {/* Warranty Note */}
              {product.warranty_months > 0 && (
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                  <p>
                    This {product.isCertified ? 'Certified Reborn™' : 'new'} unit comes with a{' '}
                    <span className="text-white font-medium">{product.warranty_months}-month warranty</span>{' '}
                    covering major components.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
