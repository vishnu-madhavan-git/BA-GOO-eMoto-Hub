import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { SuccessModal } from '@/components/SuccessModal';
import { useAppStore } from '@/data/store';
import { ArrowRight, Upload, Calculator } from 'lucide-react';

const brands = ['Segway', 'Xiaomi', 'Apollo', 'Dualtron', 'Vsett', 'Kaabo', 'Gotrax', 'Unagi', 'Other'];
const batteryConditions = ['Excellent (holds full charge)', 'Good (90%+ capacity)', 'Fair (70-90% capacity)', 'Poor (below 70%)'];
const cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

export default function TradeInPage() {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [batteryCondition, setBatteryCondition] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [showEstimate, setShowEstimate] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState({ min: 0, max: 0 });
  const [showSuccess, setShowSuccess] = useState(false);

  const addTradeInRequest = useAppStore((state) => state.addTradeInRequest);

  const calculateEstimate = () => {
    // Simple estimation logic
    let baseValue = 1000;
    
    // Adjust for brand
    if (['Segway', 'Apollo', 'Dualtron', 'Vsett'].includes(brand)) {
      baseValue += 500;
    }
    
    // Adjust for age
    const age = new Date().getFullYear() - parseInt(year);
    baseValue -= age * 150;
    
    // Adjust for mileage
    const km = parseInt(mileage);
    if (km > 3000) baseValue -= 300;
    else if (km > 2000) baseValue -= 200;
    else if (km > 1000) baseValue -= 100;
    
    // Adjust for battery
    if (batteryCondition.includes('Excellent')) baseValue += 200;
    else if (batteryCondition.includes('Good')) baseValue += 100;
    else if (batteryCondition.includes('Poor')) baseValue -= 200;

    const min = Math.max(200, baseValue - 200);
    const max = Math.max(300, baseValue + 200);

    setEstimatedValue({ min, max });
    setShowEstimate(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTradeInRequest({
      brand,
      model,
      year: parseInt(year),
      mileage: parseInt(mileage),
      batteryCondition,
      location,
      phone,
      estimatedValue,
    });

    setShowSuccess(true);
    // Reset form
    setBrand('');
    setModel('');
    setYear('');
    setMileage('');
    setBatteryCondition('');
    setLocation('');
    setPhone('');
    setShowEstimate(false);
  };

  const canCalculate = brand && model && year && mileage && batteryCondition;

  return (
    <div className="page-container">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="section-header mb-2">Trade-In Your Scooter</h1>
            <p className="section-subheader">
              Get an instant estimate and book a free inspection
            </p>
          </div>

          <div className="glass-card p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Brand & Model */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Brand</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">Select brand</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g., Max G30, Pro 4"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Year & Mileage */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">Select year</option>
                    {[2024, 2023, 2022, 2021, 2020, 2019].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Mileage (km)</label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    placeholder="e.g., 1500"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Battery Condition */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Battery Condition</label>
                <select
                  value={batteryCondition}
                  onChange={(e) => setBatteryCondition(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select condition</option>
                  {batteryConditions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Photos Placeholder */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Photos (Optional)</label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm">
                    Drag photos here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (Feature coming soon)
                  </p>
                </div>
              </div>

              {/* Calculate Button */}
              {!showEstimate && (
                <button
                  type="button"
                  onClick={calculateEstimate}
                  disabled={!canCalculate}
                  className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Get Instant Estimate
                </button>
              )}

              {/* Estimate Display */}
              {showEstimate && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Estimated Trade-In Value</p>
                  <p className="text-3xl font-bold text-primary">
                    AED {estimatedValue.min.toLocaleString()} - {estimatedValue.max.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Final value determined after inspection
                  </p>
                </div>
              )}

              {/* Contact Info */}
              {showEstimate && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Location</label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Select city</option>
                        {cities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">WhatsApp Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+971 50 123 4567"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full group">
                    Book Free Inspection
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </main>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Inspection Booked!"
        message="We'll contact you via WhatsApp to schedule your free inspection."
        referenceId={`TI-${Date.now().toString().slice(-6)}`}
      />
    </div>
  );
}
