import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { getCertifiedProducts } from '@/data/products';
import { 
  Search, Wrench, Battery, Cpu, TestTube, Award, Shield,
  CheckCircle 
} from 'lucide-react';

const processSteps = [
  { icon: Search, label: 'Intake', description: 'Full inspection & documentation' },
  { icon: Wrench, label: 'Teardown', description: 'Complete disassembly & cleaning' },
  { icon: Battery, label: 'Replace', description: 'Worn parts replaced with OEM' },
  { icon: Cpu, label: 'Tune', description: 'Controller & firmware optimization' },
  { icon: TestTube, label: 'Test', description: '50+ point quality check' },
  { icon: Award, label: 'Certify', description: 'Reborn Score assigned' },
  { icon: Shield, label: 'Warranty', description: '12-month coverage included' },
];

const benefits = [
  'Battery cells tested & optimized',
  'Brakes inspected & replaced if needed',
  'Tires replaced with premium rubber',
  'All bearings cleaned & lubricated',
  'Controller firmware updated',
  'Full cosmetic restoration',
  'Build sheet documentation',
  'Spare parts availability',
];

export default function CertifiedPage() {
  const products = getCertifiedProducts();

  return (
    <div className="page-container">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">Certified Reborn™ Program</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Built. Tuned. Certified.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Like a premium automotive tuning house, we take pre-owned scooters and rebuild them 
              to exceed factory specifications.
            </p>
          </div>

          {/* 7-Step Process */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              The 7-Step Reborn Process
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {processSteps.map((step, index) => (
                <div key={step.label} className="process-step glass-card">
                  <div className="process-step-number">{index + 1}</div>
                  <step.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-white text-sm mb-1">{step.label}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="glass-card p-8 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              What's Included in Every Reborn Build
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <span className="text-white text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="trust-badge">
              <Shield className="w-4 h-4" />
              12-Month Warranty
            </div>
            <div className="trust-badge">
              <Award className="w-4 h-4" />
              90+ Reborn Score
            </div>
            <div className="trust-badge">
              <Wrench className="w-4 h-4" />
              Spare Parts Ready
            </div>
          </div>

          {/* Products */}
          <div>
            <h2 className="section-header mb-2">Available Certified Reborn™ Units</h2>
            <p className="section-subheader mb-8">
              Each unit comes with a detailed build sheet
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
