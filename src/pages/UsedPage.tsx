import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { FilterBar } from '@/components/FilterBar';
import { getUsedProducts, getCertifiedProducts } from '@/data/products';

const filters = [
  {
    key: 'grade',
    label: 'Grade',
    options: [
      { label: 'A+ (Excellent)', value: 'A+' },
      { label: 'A (Great)', value: 'A' },
      { label: 'B (Good)', value: 'B' },
      { label: 'C (Fair)', value: 'C' },
    ],
  },
  {
    key: 'price',
    label: 'Price',
    options: [
      { label: 'Under AED 500', value: '0-500' },
      { label: 'AED 500 - 1,000', value: '500-1000' },
      { label: 'AED 1,000 - 2,000', value: '1000-2000' },
      { label: 'Over AED 2,000', value: '2000+' },
    ],
  },
  {
    key: 'battery',
    label: 'Battery Health',
    options: [
      { label: '90%+', value: '90+' },
      { label: '80-90%', value: '80-90' },
      { label: '70-80%', value: '70-80' },
      { label: 'Below 70%', value: '0-70' },
    ],
  },
  {
    key: 'mileage',
    label: 'Mileage',
    options: [
      { label: 'Under 1,000 km', value: '0-1000' },
      { label: '1,000 - 2,000 km', value: '1000-2000' },
      { label: '2,000 - 3,000 km', value: '2000-3000' },
      { label: 'Over 3,000 km', value: '3000+' },
    ],
  },
];

export default function UsedPage() {
  const [activeTab, setActiveTab] = useState<'used' | 'certified'>('used');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  
  const usedProducts = getUsedProducts();
  const certifiedProducts = getCertifiedProducts();
  
  const products = activeTab === 'used' ? usedProducts : certifiedProducts;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Grade filter
      if (activeFilters.grade?.length) {
        if (!activeFilters.grade.includes(product.grade)) return false;
      }

      // Price filter
      if (activeFilters.price?.length) {
        const matchesPrice = activeFilters.price.some((range) => {
          if (range === '0-500') return product.price < 500;
          if (range === '500-1000') return product.price >= 500 && product.price < 1000;
          if (range === '1000-2000') return product.price >= 1000 && product.price < 2000;
          if (range === '2000+') return product.price >= 2000;
          return true;
        });
        if (!matchesPrice) return false;
      }

      // Battery filter
      if (activeFilters.battery?.length) {
        const matchesBattery = activeFilters.battery.some((range) => {
          if (range === '90+') return product.battery_health_pct >= 90;
          if (range === '80-90') return product.battery_health_pct >= 80 && product.battery_health_pct < 90;
          if (range === '70-80') return product.battery_health_pct >= 70 && product.battery_health_pct < 80;
          if (range === '0-70') return product.battery_health_pct < 70;
          return true;
        });
        if (!matchesBattery) return false;
      }

      // Mileage filter
      if (activeFilters.mileage?.length) {
        const matchesMileage = activeFilters.mileage.some((range) => {
          if (range === '0-1000') return product.mileage_km < 1000;
          if (range === '1000-2000') return product.mileage_km >= 1000 && product.mileage_km < 2000;
          if (range === '2000-3000') return product.mileage_km >= 2000 && product.mileage_km < 3000;
          if (range === '3000+') return product.mileage_km >= 3000;
          return true;
        });
        if (!matchesMileage) return false;
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
            <h1 className="section-header">Shop Used E-Scooters</h1>
            <p className="section-subheader">
              Inspected pre-owned scooters at great prices
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-secondary rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('used')}
              className={`tab-button ${activeTab === 'used' ? 'active' : ''}`}
            >
              Used (As-Is)
              <span className="ml-2 text-xs opacity-60">({usedProducts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('certified')}
              className={`tab-button ${activeTab === 'certified' ? 'active' : ''}`}
            >
              Certified Reborn™
              <span className="ml-2 text-xs opacity-60">({certifiedProducts.length})</span>
            </button>
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
