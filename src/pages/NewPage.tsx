import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { FilterBar } from '@/components/FilterBar';
import { getNewProducts } from '@/data/products';

const filters = [
  {
    key: 'price',
    label: 'Price',
    options: [
      { label: 'Under AED 2,000', value: '0-2000' },
      { label: 'AED 2,000 - 3,000', value: '2000-3000' },
      { label: 'AED 3,000 - 5,000', value: '3000-5000' },
      { label: 'Over AED 5,000', value: '5000+' },
    ],
  },
  {
    key: 'range',
    label: 'Range',
    options: [
      { label: '30-50 km', value: '30-50' },
      { label: '50-70 km', value: '50-70' },
      { label: '70+ km', value: '70+' },
    ],
  },
  {
    key: 'speed',
    label: 'Speed',
    options: [
      { label: 'Up to 25 km/h', value: '0-25' },
      { label: '25-40 km/h', value: '25-40' },
      { label: '40+ km/h', value: '40+' },
    ],
  },
  {
    key: 'brand',
    label: 'Brand',
    options: [
      { label: 'Segway', value: 'Segway' },
      { label: 'Xiaomi', value: 'Xiaomi' },
      { label: 'Apollo', value: 'Apollo' },
      { label: 'Dualtron', value: 'Dualtron' },
    ],
  },
];

export default function NewPage() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const products = getNewProducts();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Price filter
      if (activeFilters.price?.length) {
        const matchesPrice = activeFilters.price.some((range) => {
          if (range === '0-2000') return product.price < 2000;
          if (range === '2000-3000') return product.price >= 2000 && product.price < 3000;
          if (range === '3000-5000') return product.price >= 3000 && product.price < 5000;
          if (range === '5000+') return product.price >= 5000;
          return true;
        });
        if (!matchesPrice) return false;
      }

      // Range filter
      if (activeFilters.range?.length) {
        const matchesRange = activeFilters.range.some((range) => {
          if (range === '30-50') return product.range_km >= 30 && product.range_km < 50;
          if (range === '50-70') return product.range_km >= 50 && product.range_km < 70;
          if (range === '70+') return product.range_km >= 70;
          return true;
        });
        if (!matchesRange) return false;
      }

      // Speed filter
      if (activeFilters.speed?.length) {
        const matchesSpeed = activeFilters.speed.some((range) => {
          if (range === '0-25') return product.top_speed_kmh <= 25;
          if (range === '25-40') return product.top_speed_kmh > 25 && product.top_speed_kmh <= 40;
          if (range === '40+') return product.top_speed_kmh > 40;
          return true;
        });
        if (!matchesSpeed) return false;
      }

      // Brand filter
      if (activeFilters.brand?.length) {
        if (!activeFilters.brand.includes(product.brand)) return false;
      }

      return true;
    });
  }, [products, activeFilters]);

  const handleFilterChange = (key: string, values: string[]) => {
    setActiveFilters((prev) => ({ ...prev, [key]: values }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  return (
    <div className="page-container">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="section-header">Shop New E-Scooters</h1>
            <p className="section-subheader">
              Latest models with manufacturer warranty
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <FilterBar
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'scooter' : 'scooters'}
          </p>

          {/* Product Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No scooters match your filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
