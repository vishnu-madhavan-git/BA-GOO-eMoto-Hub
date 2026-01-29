export interface BuildPackage {
  id: string;
  name: string;
  description: string;
  price_addon: number;
  includes: string[];
  icon: string;
  color: string;
}

export const buildPackages: BuildPackage[] = [
  {
    id: 'street-pack',
    name: 'Street Pack',
    description: 'Urban performance essentials for daily riding',
    price_addon: 299,
    includes: [
      'Premium street tires',
      'Brake pad upgrade',
      'Suspension tune',
      'Safety reflectors',
      'Handlebar grips',
    ],
    icon: 'Gauge',
    color: 'primary',
  },
  {
    id: 'range-pack',
    name: 'Range Pack',
    description: 'Maximum distance optimization',
    price_addon: 449,
    includes: [
      'Battery health optimization',
      'Efficient riding mode tune',
      'Regenerative braking calibration',
      'Tire pressure optimization',
      'Energy monitoring display',
    ],
    icon: 'Battery',
    color: 'green',
  },
  {
    id: 'power-pack',
    name: 'Power Pack',
    description: 'Unleash maximum performance',
    price_addon: 599,
    includes: [
      'Controller tune',
      'Acceleration profile upgrade',
      'Motor efficiency tune',
      'Performance firmware',
      'Speed limit adjustment',
    ],
    icon: 'Zap',
    color: 'orange',
  },
  {
    id: 'night-pack',
    name: 'Night Pack',
    description: 'Visibility and safety for night riders',
    price_addon: 199,
    includes: [
      'LED headlight upgrade',
      'Tail light enhancement',
      'Side reflectors',
      'Under-deck lighting',
      'Reflective tape kit',
    ],
    icon: 'Moon',
    color: 'purple',
  },
  {
    id: 'cargo-pack',
    name: 'Cargo Pack',
    description: 'Built for hauling and durability',
    price_addon: 349,
    includes: [
      'Rear cargo mount',
      'Front basket bracket',
      'Puncture-resistant tires',
      'Heavy-duty kickstand',
      'Frame reinforcement',
    ],
    icon: 'Package',
    color: 'blue',
  },
];
