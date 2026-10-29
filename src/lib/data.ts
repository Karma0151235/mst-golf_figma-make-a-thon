export type Level = 'beginner' | 'intermediate' | 'professional'

export type Screen =
  | 'loading'
  | 'signup'
  | 'level'
  | 'ability'
  | 'equipment'
  | 'great'
  | 'gear'
  | 'cart'
  | 'findLocation'
  | 'map'
  | 'home'
  | 'tutorial'

export type Profile = {
  name: string
  email: string
  provider: 'email' | 'google' | 'apple'
  level: Level | null
  ability: { needsSupport: boolean; notes: string[] } | null
  hasGear: boolean | null
}

export type GearItem = {
  id: string
  brand: string
  name: string
  category: 'Clubs' | 'Balls' | 'Glove' | 'Bag' | 'Shoes' | 'Tech' | 'Accessories'
  price: number
  why: string
}

export const PHOTOS = {
  loading:
    'https://images.unsplash.com/photo-1788864359659-38a7b1e9fa96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  aerial:
    'https://images.unsplash.com/photo-1694636507260-8b2428e3b738?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  rangeNight:
    'https://images.unsplash.com/photo-1791605070369-db524fe54633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  walker:
    'https://images.unsplash.com/photo-1693163575378-ac9f465ce03c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  bag: 'https://images.unsplash.com/photo-1693163532134-5ea6c80b58a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ball: 'https://images.unsplash.com/photo-1562204320-31975a5e09ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
}

export const LEVELS: { id: Level; title: string; handicap: string; blurb: string }[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    handicap: 'New or 30+ handicap',
    blurb: 'Just picking up a club, or still finding the fairway.',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    handicap: '10 – 29 handicap',
    blurb: 'Consistent contact. Working on distance and the short game.',
  },
  {
    id: 'professional',
    title: 'Professional',
    handicap: 'Single digit or tour',
    blurb: 'Tuned swing. Here for data, dialled gear and competition.',
  },
]

// Prices are indicative (MYR) for the demo; product lines mirror MST Golf's catalogue.
export const GEAR: Record<Level, GearItem[]> = {
  beginner: [
    {
      id: 'b-set',
      brand: 'Callaway',
      name: 'Strata Complete Package Set',
      category: 'Clubs',
      price: 1899,
      why: 'Forgiving driver, hybrid, irons and putter in one bag.',
    },
    {
      id: 'b-balls',
      brand: 'Wilson',
      name: 'Duo Soft Golf Balls (12)',
      category: 'Balls',
      price: 89,
      why: 'Low compression for easier launch at slower speeds.',
    },
    {
      id: 'b-glove',
      brand: 'FootJoy',
      name: 'WeatherSof Glove',
      category: 'Glove',
      price: 59,
      why: 'Durable grip that forgives a still-learning hold.',
    },
    {
      id: 'b-tees',
      brand: 'Golf Lite',
      name: 'T-218 Wood Tees 82mm',
      category: 'Accessories',
      price: 15,
      why: 'Tall tees to help you sweep the driver.',
    },
  ],
  intermediate: [
    {
      id: 'i-irons',
      brand: 'TaylorMade',
      name: 'Qi MAX Irons 6–PW',
      category: 'Clubs',
      price: 3899,
      why: 'Game-improvement distance with a cleaner look at address.',
    },
    {
      id: 'i-balls',
      brand: 'Titleist',
      name: 'Tour Soft Golf Balls (12)',
      category: 'Balls',
      price: 129,
      why: 'More greenside spin as your short game sharpens.',
    },
    {
      id: 'i-bag',
      brand: 'Sun Mountain',
      name: '8.5 Matchplay Stand Bag',
      category: 'Bag',
      price: 899,
      why: 'Light enough to walk 18, with a 4-way top.',
    },
    {
      id: 'i-shoes',
      brand: 'adidas',
      name: 'Adipower Spikeless Shoes',
      category: 'Shoes',
      price: 649,
      why: 'Stable base for a more aggressive weight shift.',
    },
  ],
  professional: [
    {
      id: 'p-irons',
      brand: 'Honma',
      name: 'TW-PX Irons 5–10',
      category: 'Clubs',
      price: 6499,
      why: 'Forged feel and workability for shot-shaping.',
    },
    {
      id: 'p-balls',
      brand: 'TaylorMade',
      name: 'TP5 Golf Balls (12)',
      category: 'Balls',
      price: 229,
      why: 'Five-layer tour ball for spin control into greens.',
    },
    {
      id: 'p-range',
      brand: 'Garmin',
      name: 'Approach Z10 Rangefinder',
      category: 'Tech',
      price: 1899,
      why: 'Slope-adjusted yardages to the flag in a click.',
    },
    {
      id: 'p-lm',
      brand: 'Garmin',
      name: 'Approach R50 Launch Monitor',
      category: 'Tech',
      price: 21999,
      why: 'Tour-level launch data at home or the range.',
    },
  ],
}

export type ArenaLocation = {
  id: string
  name: string
  area: string
  address: string
  lat: number
  lng: number
  hours: string
  bays: number
  phone: string
  features: string[]
}

// The Gardens is MST's flagship Arena; other entries are illustrative demo sites.
export const LOCATIONS: ArenaLocation[] = [
  {
    id: 'gardens',
    name: 'Golf Arena · The Gardens',
    area: 'Mid Valley City',
    address: 'The Gardens Mall, Lingkaran Syed Putra, 59200 Kuala Lumpur',
    lat: 3.1186,
    lng: 101.6773,
    hours: '10:00 – 01:00 daily',
    bays: 18,
    phone: '+60 3-2201 0000',
    features: ['Tee Box Restaurant & Bar', 'Accessible bays', 'Club fitting'],
  },
  {
    id: 'bukit-jalil',
    name: 'Golf Arena · Bukit Jalil',
    area: 'Pavilion Bukit Jalil',
    address: 'Persiaran Jalil 1, Bukit Jalil, 57000 Kuala Lumpur',
    lat: 3.0498,
    lng: 101.6706,
    hours: '10:00 – 00:00 daily',
    bays: 14,
    phone: '+60 3-8600 0000',
    features: ['Family bays', 'Junior coaching', 'Accessible bays'],
  },
  {
    id: 'sunway',
    name: 'Golf Arena · Sunway',
    area: 'Bandar Sunway',
    address: 'Jalan PJS 11/15, Bandar Sunway, 47500 Petaling Jaya',
    lat: 3.0733,
    lng: 101.6078,
    hours: '11:00 – 00:00 daily',
    bays: 12,
    phone: '+60 3-5600 0000',
    features: ['Event space', 'Simulator leagues'],
  },
  {
    id: 'damansara',
    name: 'Golf Arena · Damansara',
    area: 'Bandar Utama',
    address: 'Lebuh Bandar Utama, Bandar Utama, 47800 Petaling Jaya',
    lat: 3.1502,
    lng: 101.6155,
    hours: '10:00 – 00:00 daily',
    bays: 10,
    phone: '+60 3-7700 0000',
    features: ['Club fitting', 'Pro shop', 'Accessible bays'],
  },
  {
    id: 'klcc',
    name: 'Golf Arena · KLCC',
    area: 'Kuala Lumpur City Centre',
    address: 'Jalan Ampang, Kuala Lumpur City Centre, 50450 Kuala Lumpur',
    lat: 3.1579,
    lng: 101.7123,
    hours: '11:00 – 01:00 daily',
    bays: 16,
    phone: '+60 3-2380 0000',
    features: ['Rooftop bar', 'Corporate events'],
  },
]

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

export const rm = (n: number) =>
  'RM ' + n.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
