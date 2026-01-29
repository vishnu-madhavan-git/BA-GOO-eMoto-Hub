import { Link } from 'react-router-dom';
import { Battery, Gauge, Zap, Shield, MapPin } from 'lucide-react';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const gradeColors: Record<string, string> = {
    'A+': 'grade-a-plus',
    'A': 'grade-a',
    'B': 'grade-b',
    'C': 'grade-c',
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card group block">
      {/* Image Placeholder */}
      <div className="relative aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary to-background mb-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-24 h-24 text-white/10"
            fill="currentColor"
          >
            <ellipse cx="50" cy="85" rx="30" ry="8" opacity="0.3" />
            <rect x="20" y="40" width="60" height="4" rx="2" />
            <rect x="15" y="38" width="8" height="8" rx="4" />
            <circle cx="25" cy="70" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="75" cy="70" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
            <rect x="70" y="35" width="12" height="25" rx="2" />
            <rect x="35" y="20" width="6" height="20" rx="2" transform="rotate(-15 38 30)" />
          </svg>
        </div>

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {product.isCertified && (
            <span className="spec-pill-primary text-xs">
              <Shield className="w-3 h-3" />
              Certified Reborn™
            </span>
          )}
          {product.tags.slice(0, 1).map((tag) => (
            <span key={tag} className="spec-pill text-xs">
              {tag}
            </span>
          ))}
        </div>

        {/* Grade Badge */}
        {product.type === 'used' && (
          <div className={`grade-badge absolute top-3 right-3 ${gradeColors[product.grade]}`}>
            {product.grade}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-primary">
              AED {product.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-2">
          <span className="spec-pill">
            <Gauge className="w-3 h-3" />
            {product.top_speed_kmh} km/h
          </span>
          <span className="spec-pill">
            <Zap className="w-3 h-3" />
            {product.range_km} km
          </span>
          {product.type === 'used' && (
            <span className="spec-pill">
              <Battery className="w-3 h-3" />
              {product.battery_health_pct}%
            </span>
          )}
        </div>

        {/* Location & Warranty */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {product.city}
          </span>
          {product.warranty_months > 0 && (
            <span className="warranty-badge">
              <Shield className="w-3 h-3" />
              {product.warranty_months}mo warranty
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
