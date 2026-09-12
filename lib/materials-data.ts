export type Material = {
  id: string
  name: string
  category: "marble" | "granite" | "porcelain" | "onyx"
  origin: string
  image: string
  price: number
  unit: string
  thickness: string[]
  finish: string[]
  application: string[]
  description: string
  inStock: boolean
  stockQuantity: number
  featured: boolean
}

export const materials: Material[] = [
  {
    id: "calacatta-gold",
    name: "Calacatta Gold",
    category: "marble",
    origin: "Italy",
    image: "/images/marble-calacatta.jpg",
    price: 850,
    unit: "sqm",
    thickness: ["15mm", "20mm", "30mm"],
    finish: ["Polished", "Honed", "Brushed"],
    application: ["Flooring", "Wall Cladding", "Countertops", "Bathroom"],
    description: "Calacatta Gold is one of the most luxurious and sought-after marbles in the world. Quarried from the mountains of Carrara, Italy, it features a pristine white background with bold, dramatic gold and grey veining that creates an unmistakable statement in any space.",
    inStock: true,
    stockQuantity: 245,
    featured: true,
  },
  {
    id: "black-galaxy",
    name: "Black Galaxy",
    category: "granite",
    origin: "India",
    image: "/images/granite-black.jpg",
    price: 650,
    unit: "sqm",
    thickness: ["20mm", "30mm"],
    finish: ["Polished", "Flamed", "Leathered"],
    application: ["Flooring", "Countertops", "Exterior", "Stairs"],
    description: "Black Galaxy granite is a stunning natural stone featuring a deep black background scattered with golden and copper flecks that sparkle like stars. Quarried from Andhra Pradesh, India, it is one of the most popular granites for luxury interiors.",
    inStock: true,
    stockQuantity: 380,
    featured: true,
  },
  {
    id: "nero-marquina",
    name: "Nero Marquina",
    category: "porcelain",
    origin: "Spain",
    image: "/images/porcelain-nero.jpg",
    price: 450,
    unit: "sqm",
    thickness: ["10mm", "12mm"],
    finish: ["Polished", "Matte", "Structured"],
    application: ["Flooring", "Wall Cladding", "Bathroom", "Kitchen"],
    description: "Nero Marquina porcelain tiles replicate the timeless elegance of Spanish black marble with crisp white veining. These large format tiles offer the beauty of natural stone with the durability and low maintenance of porcelain.",
    inStock: true,
    stockQuantity: 520,
    featured: true,
  },
  {
    id: "honey-onyx",
    name: "Honey Onyx",
    category: "onyx",
    origin: "Iran",
    image: "/images/onyx-honey.jpg",
    price: 1200,
    unit: "sqm",
    thickness: ["15mm", "20mm"],
    finish: ["Polished", "Backlit"],
    application: ["Feature Walls", "Bar Tops", "Lighting Panels", "Decorative"],
    description: "Honey Onyx is a translucent exotic stone with warm amber, gold, and cream tones flowing throughout. When backlit, it creates a stunning luminous effect, making it perfect for feature walls, bar tops, and decorative applications.",
    inStock: true,
    stockQuantity: 85,
    featured: true,
  },
  {
    id: "statuario-white",
    name: "Statuario White",
    category: "marble",
    origin: "Italy",
    image: "/images/statuario-white.jpg",
    price: 950,
    unit: "sqm",
    thickness: ["15mm", "20mm", "30mm"],
    finish: ["Polished", "Honed"],
    application: ["Flooring", "Wall Cladding", "Countertops", "Sculpture"],
    description: "Statuario marble is the most prestigious of Italian white marbles, featuring a bright white background with dramatic grey veining. Used throughout history in the finest palaces and sculptures, it represents the pinnacle of luxury.",
    inStock: true,
    stockQuantity: 120,
    featured: false,
  },
  {
    id: "emperador-dark",
    name: "Emperador Dark",
    category: "marble",
    origin: "Spain",
    image: "/images/emperador-dark.jpg",
    price: 550,
    unit: "sqm",
    thickness: ["15mm", "20mm"],
    finish: ["Polished", "Honed", "Tumbled"],
    application: ["Flooring", "Wall Cladding", "Bathroom", "Fireplace"],
    description: "Emperador Dark is a rich chocolate brown marble with cream and gold veining. Quarried in Spain, this warm-toned stone adds elegance and sophistication to any interior space.",
    inStock: true,
    stockQuantity: 290,
    featured: false,
  },
  {
    id: "crema-marfil",
    name: "Crema Marfil",
    category: "marble",
    origin: "Spain",
    image: "/images/marble-calacatta.jpg",
    price: 480,
    unit: "sqm",
    thickness: ["15mm", "20mm", "30mm"],
    finish: ["Polished", "Honed", "Brushed"],
    application: ["Flooring", "Wall Cladding", "Countertops", "Bathroom"],
    description: "Crema Marfil is a classic Spanish marble known for its warm beige tones and subtle veining. One of the most versatile marbles, it complements both traditional and contemporary designs.",
    inStock: true,
    stockQuantity: 410,
    featured: false,
  },
  {
    id: "absolute-black",
    name: "Absolute Black",
    category: "granite",
    origin: "India",
    image: "/images/granite-black.jpg",
    price: 580,
    unit: "sqm",
    thickness: ["20mm", "30mm", "40mm"],
    finish: ["Polished", "Flamed", "Leathered", "Honed"],
    application: ["Flooring", "Countertops", "Exterior", "Monuments"],
    description: "Absolute Black granite is a deep, uniform black stone without any veining or patterns. Its pure black color makes it ideal for sleek, modern designs and high-contrast applications.",
    inStock: true,
    stockQuantity: 350,
    featured: false,
  },
  {
    id: "carrara-white",
    name: "Carrara White",
    category: "marble",
    origin: "Italy",
    image: "/images/statuario-white.jpg",
    price: 520,
    unit: "sqm",
    thickness: ["15mm", "20mm", "30mm"],
    finish: ["Polished", "Honed", "Tumbled"],
    application: ["Flooring", "Wall Cladding", "Countertops", "Bathroom"],
    description: "Carrara marble is the most iconic Italian marble, featuring a soft white to bluish-grey background with delicate grey veining. It has been the stone of choice for sculptors and architects for centuries.",
    inStock: true,
    stockQuantity: 680,
    featured: false,
  },
  {
    id: "travertine-classic",
    name: "Travertine Classic",
    category: "marble",
    origin: "Turkey",
    image: "/images/emperador-dark.jpg",
    price: 380,
    unit: "sqm",
    thickness: ["15mm", "20mm", "30mm"],
    finish: ["Polished", "Honed", "Tumbled", "Filled"],
    application: ["Flooring", "Wall Cladding", "Exterior", "Pool Surrounds"],
    description: "Classic Travertine is a natural limestone with a unique porous texture and warm earth tones. Available in various finishes, it creates a timeless Mediterranean aesthetic.",
    inStock: true,
    stockQuantity: 520,
    featured: false,
  },
  {
    id: "verde-guatemala",
    name: "Verde Guatemala",
    category: "marble",
    origin: "India",
    image: "/images/porcelain-nero.jpg",
    price: 720,
    unit: "sqm",
    thickness: ["15mm", "20mm"],
    finish: ["Polished", "Honed"],
    application: ["Flooring", "Wall Cladding", "Countertops", "Decorative"],
    description: "Verde Guatemala is a striking dark green marble with white and light green veining. This exotic stone makes a bold statement in luxury residential and commercial projects.",
    inStock: true,
    stockQuantity: 95,
    featured: false,
  },
  {
    id: "blue-bahia",
    name: "Blue Bahia",
    category: "granite",
    origin: "Brazil",
    image: "/images/granite-black.jpg",
    price: 1800,
    unit: "sqm",
    thickness: ["20mm", "30mm"],
    finish: ["Polished", "Leathered"],
    application: ["Countertops", "Feature Walls", "Decorative", "Bathroom"],
    description: "Blue Bahia is one of the rarest and most valuable granites in the world. Its vibrant blue color with golden flecks creates an absolutely stunning visual impact in any application.",
    inStock: false,
    stockQuantity: 0,
    featured: false,
  },
]

export const categories = [
  { id: "all", name: "All Materials" },
  { id: "marble", name: "Marble" },
  { id: "granite", name: "Granite" },
  { id: "porcelain", name: "Porcelain Tiles" },
  { id: "onyx", name: "Onyx" },
]

export function getMaterialById(id: string): Material | undefined {
  return materials.find((m) => m.id === id)
}

export function getMaterialsByCategory(category: string): Material[] {
  if (category === "all") return materials
  return materials.filter((m) => m.category === category)
}

export function getFeaturedMaterials(): Material[] {
  return materials.filter((m) => m.featured)
}
