import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { SuccessModal } from '@/components/SuccessModal';
import { useAppStore } from '@/data/store';
import { ArrowRight, Wrench, Battery, Shield, Zap, CheckCircle } from 'lucide-react';

const servicePlans = [
  {
    name: 'Basic Tune-Up',
    price: 149,
    icon: Wrench,
    includes: ['Brake adjustment', 'Tire pressure check', 'Basic cleaning', 'Safety inspection'],
  },
  {
    name: 'Full Service',
    price: 299,
    icon: Battery,
    includes: ['Everything in Basic', 'Battery health check', 'Firmware update', 'Lubrication', 'Tightening all bolts'],
  },
  {
    name: 'Premium Care',
    price: 499,
    icon: Shield,
    includes: ['Everything in Full Service', 'Brake pad replacement', 'Deep cleaning', 'Performance optimization', 'Priority support'],
  },
];

const issues = [
  'General maintenance',
  'Battery not charging',
  'Brake issues',
  'Motor problems',
  'Display/dashboard issues',
  'Flat tire',
  'Strange noises',
  'Speed limiter',
  'Other',
];

const cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

export default function ServicePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [scooterDetails, setScooterDetails] = useState('');
  const [issue, setIssue] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [city, setCity] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const addServiceTicket = useAppStore((state) => state.addServiceTicket);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const id = `SVC-${Date.now().toString().slice(-6)}`;
    setTicketId(id);

    addServiceTicket({
      name,
      phone,
      scooter_details: scooterDetails,
      issue,
      preferred_date: preferredDate,
      city,
    });

    setShowSuccess(true);
    // Reset form
    setName('');
    setPhone('');
    setScooterDetails('');
    setIssue('');
    setPreferredDate('');
    setCity('');
  };

  return (
    <div className="page-container">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="section-header mb-2">Service Center</h1>
            <p className="section-subheader">
              Expert maintenance and repairs for all e-scooter brands
            </p>
          </div>

          {/* Service Plans */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {servicePlans.map((plan) => (
              <div key={plan.name} className="glass-card p-6 hover:border-primary/30 transition-colors">
                <plan.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold text-primary mb-4">
                  AED {plan.price}
                </p>
                <ul className="space-y-2">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Booking Form */}
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Book a Service Appointment
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="form-input"
                      required
                    />
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

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Scooter Details</label>
                  <input
                    type="text"
                    value={scooterDetails}
                    onChange={(e) => setScooterDetails(e.target.value)}
                    placeholder="Brand and model (e.g., Segway Ninebot Max G30)"
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Issue / Service Type</label>
                  <select
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">Select issue</option>
                    {issues.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Preferred Date</label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="form-input"
                      required
                    >
                      <option value="">Select city</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full group">
                  Book Appointment
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Appointment Booked!"
        message="We'll confirm your appointment via WhatsApp shortly."
        referenceId={ticketId}
      />
    </div>
  );
}
