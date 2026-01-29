import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { SuccessModal } from '@/components/SuccessModal';
import { useAppStore } from '@/data/store';
import { buildPackages } from '@/data/buildPackages';
import { products } from '@/data/products';
import { 
  Gauge, Battery, Zap, Moon, Package, 
  Check, ChevronDown, ArrowRight 
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Gauge,
  Battery,
  Zap,
  Moon,
  Package,
};

const colorMap: Record<string, string> = {
  primary: 'bg-primary/20 border-primary/30 text-primary',
  green: 'bg-green-500/20 border-green-500/30 text-green-400',
  orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
  purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
  blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
};

export default function ModLabPage() {
  const [selectedScooter, setSelectedScooter] = useState<string>('');
  const [selectedPacks, setSelectedPacks] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const addLead = useAppStore((state) => state.addLead);

  const scooter = products.find(p => p.id === selectedScooter);
  const totalAddon = buildPackages
    .filter(p => selectedPacks.includes(p.id))
    .reduce((sum, p) => sum + p.price_addon, 0);

  const togglePack = (packId: string) => {
    setSelectedPacks(prev => 
      prev.includes(packId) 
        ? prev.filter(id => id !== packId)
        : [...prev, packId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScooter || selectedPacks.length === 0 || !name || !phone) return;

    addLead({
      name,
      phone,
      intent: 'mod-lab',
      product_id: selectedScooter,
      city: scooter?.city || 'Dubai',
      message: `Build packages: ${selectedPacks.join(', ')}`,
    });

    setShowSuccess(true);
    setName('');
    setPhone('');
    setSelectedScooter('');
    setSelectedPacks([]);
  };

  return (
    <div className="page-container">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="section-header mb-2">Mod Lab</h1>
            <p className="section-subheader max-w-2xl mx-auto">
              Customize your ride with our performance packages. 
              Select a base scooter and add the packs that match your riding style.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Configuration */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Select Scooter */}
              <div className="glass-card p-6">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  Choose Your Base Scooter
                </h2>

                <div className="relative">
                  <select
                    value={selectedScooter}
                    onChange={(e) => setSelectedScooter(e.target.value)}
                    className="form-input appearance-none pr-10"
                  >
                    <option value="">Select a scooter...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - AED {product.price.toLocaleString()} ({product.type === 'new' ? 'New' : product.isCertified ? 'Certified' : 'Used'})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>

                {scooter && (
                  <div className="mt-4 p-4 bg-secondary rounded-xl flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-background flex items-center justify-center">
                      <Gauge className="w-8 h-8 text-white/20" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{scooter.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {scooter.range_km} km range • {scooter.top_speed_kmh} km/h
                      </p>
                      <p className="text-primary font-bold mt-1">
                        AED {scooter.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Select Packages */}
              <div className="glass-card p-6">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Select Build Packages
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {buildPackages.map((pack) => {
                    const Icon = iconMap[pack.icon];
                    const isSelected = selectedPacks.includes(pack.id);

                    return (
                      <button
                        key={pack.id}
                        onClick={() => togglePack(pack.id)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/10' 
                            : 'border-white/10 bg-secondary hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg border ${colorMap[pack.color]}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-white mb-1">{pack.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{pack.description}</p>
                        
                        <div className="space-y-1 mb-3">
                          {pack.includes.slice(0, 3).map((item) => (
                            <p key={item} className="text-xs text-muted-foreground flex items-center gap-1">
                              <Check className="w-3 h-3 text-primary" />
                              {item}
                            </p>
                          ))}
                          {pack.includes.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{pack.includes.length - 3} more
                            </p>
                          )}
                        </div>

                        <p className="text-primary font-bold">
                          +AED {pack.price_addon}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <h2 className="font-semibold text-white mb-4">Build Summary</h2>

                {scooter ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base: {scooter.name}</span>
                      <span className="text-white">AED {scooter.price.toLocaleString()}</span>
                    </div>

                    {selectedPacks.map((packId) => {
                      const pack = buildPackages.find(p => p.id === packId);
                      if (!pack) return null;
                      return (
                        <div key={packId} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{pack.name}</span>
                          <span className="text-white">+AED {pack.price_addon}</span>
                        </div>
                      );
                    })}

                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-white">Estimated Total</span>
                        <span className="text-primary">
                          AED {(scooter.price + totalAddon).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {selectedPacks.length > 0 && (
                      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="form-input"
                          required
                        />
                        <input
                          type="tel"
                          placeholder="WhatsApp number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="form-input"
                          required
                        />
                        <button type="submit" className="btn-primary w-full group">
                          Request Build Quote
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Select a scooter to start building
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Quote Request Sent!"
        message="We'll reach out via WhatsApp within 24 hours with your custom build quote."
      />
    </div>
  );
}
