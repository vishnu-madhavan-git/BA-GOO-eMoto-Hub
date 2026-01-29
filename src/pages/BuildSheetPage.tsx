import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { getProductById } from '@/data/products';
import { 
  ArrowLeft, CheckCircle, Battery, Wrench, 
  Cpu, TestTube, Award, Shield, Calendar
} from 'lucide-react';

// Mock build sheet data
const getBuildSheetData = (productId: string) => ({
  rebuildDate: '2024-01-15',
  technician: 'Ahmed K.',
  workOrder: `WO-${productId.slice(-4).toUpperCase()}`,
  replacedParts: [
    { part: 'Battery cells (18650)', quantity: 20, status: 'new' },
    { part: 'Brake pads (front & rear)', quantity: 2, status: 'new' },
    { part: 'Handlebar grips', quantity: 2, status: 'new' },
    { part: 'Tires (10" pneumatic)', quantity: 2, status: 'new' },
    { part: 'Bearings (wheel)', quantity: 4, status: 'new' },
    { part: 'Deck grip tape', quantity: 1, status: 'new' },
  ],
  inspectionResults: [
    { category: 'Frame Integrity', score: 98, notes: 'No cracks or damage' },
    { category: 'Motor Function', score: 100, notes: 'Optimal performance' },
    { category: 'Controller Health', score: 95, notes: 'Firmware updated' },
    { category: 'Battery Capacity', score: 94, notes: 'Cells balanced' },
    { category: 'Brake System', score: 100, notes: 'New pads installed' },
    { category: 'Suspension', score: 92, notes: 'Adjusted and lubricated' },
    { category: 'Electrical System', score: 96, notes: 'All connections secure' },
    { category: 'Display/Controls', score: 100, notes: 'Fully functional' },
  ],
  firmware: {
    version: 'v2.4.1',
    updateDate: '2024-01-14',
    optimizations: ['Regenerative braking improved', 'Battery management optimized', 'Speed curve smoothed'],
  },
  warranty: {
    duration: '12 months',
    coverage: ['Motor', 'Controller', 'Battery', 'Frame'],
    startDate: '2024-01-16',
    endDate: '2025-01-16',
  },
});

export default function BuildSheetPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');

  if (!product || !product.isCertified) {
    return (
      <div className="page-container">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Build sheet not available</h1>
            <Link to="/" className="text-primary hover:underline">
              Return to home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const buildSheet = getBuildSheetData(product.id);
  const avgScore = Math.round(
    buildSheet.inspectionResults.reduce((sum, r) => sum + r.score, 0) / 
    buildSheet.inspectionResults.length
  );

  return (
    <div className="page-container">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Product
          </Link>

          {/* Header */}
          <div className="glass-card p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-primary" />
                  <span className="text-primary font-semibold">Certified Reborn™ Build Sheet</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {product.name}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Work Order</p>
                <p className="font-mono text-white font-semibold">{buildSheet.workOrder}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Rebuild Date</p>
                <p className="text-white font-medium">{buildSheet.rebuildDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Technician</p>
                <p className="text-white font-medium">{buildSheet.technician}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Final Score</p>
                <p className="text-primary font-bold text-xl">{avgScore}/100</p>
              </div>
            </div>
          </div>

          {/* Replaced Parts */}
          <div className="glass-card p-6 mb-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              Replaced Parts
            </h2>
            <div className="space-y-3">
              {buildSheet.replacedParts.map((item) => (
                <div key={item.part} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white">{item.part}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground text-sm">x{item.quantity}</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 font-medium uppercase">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inspection Results */}
          <div className="glass-card p-6 mb-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <TestTube className="w-5 h-5 text-primary" />
              50-Point Inspection Results
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {buildSheet.inspectionResults.map((result) => (
                <div key={result.category} className="bg-secondary rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{result.category}</span>
                    <span className={`font-bold ${result.score >= 95 ? 'text-green-400' : result.score >= 90 ? 'text-primary' : 'text-orange-400'}`}>
                      {result.score}%
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${result.score >= 95 ? 'bg-green-400' : result.score >= 90 ? 'bg-primary' : 'bg-orange-400'}`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{result.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Firmware */}
          <div className="glass-card p-6 mb-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              Firmware Update
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-mono text-primary font-semibold">{buildSheet.firmware.version}</span>
              <span className="text-muted-foreground">Updated:</span>
              <span className="text-white">{buildSheet.firmware.updateDate}</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Optimizations included:</p>
              {buildSheet.firmware.optimizations.map((opt) => (
                <div key={opt} className="flex items-center gap-2 text-sm text-white">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {opt}
                </div>
              ))}
            </div>
          </div>

          {/* Warranty */}
          <div className="glass-card p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Warranty Coverage
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Duration</p>
                <p className="text-2xl font-bold text-primary">{buildSheet.warranty.duration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Valid Period</p>
                <p className="text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {buildSheet.warranty.startDate} → {buildSheet.warranty.endDate}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-muted-foreground mb-2">Covered Components:</p>
              <div className="flex flex-wrap gap-2">
                {buildSheet.warranty.coverage.map((item) => (
                  <span key={item} className="spec-pill-primary">
                    <CheckCircle className="w-3 h-3" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
