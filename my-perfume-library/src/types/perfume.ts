
export type PerfumeConcentration =
  | 'Parfum'
  | 'Eau de Parfum'
  | 'Eau de Toilette'
  | 'Eau de Cologne'
  | 'Other'

export type FragranceFamily =
  | 'Floral'
  | 'Woody'
  | 'Fresh'
  | 'Oriental'
  | 'Citrus'
  | 'Fruity'
  | 'Gourmand'
  | 'Other'

export type Season =
  | 'Spring'
  | 'Summer'
  | 'Autumn'
  | 'Winter'

export type Currency = 'EGP' | 'USD' | 'EUR' | 'Other'

export interface PerfumePurchase {
  id: string
  purchaseDate: string
  volumeMl: number
  unitPrice: number
  currency: Currency
  store: string
  quantityPurchased: number
  quantityRemaining: number
  notes: string
}

export interface Perfume {
  id: string
  name: string
  brand: string
  concentration: PerfumeConcentration
  fragranceFamily: FragranceFamily
  topNotes: string[]
  middleNotes: string[]
  baseNotes: string[]
  seasons: Season[]
  imageUrl: string
  description: string
  personalRating: number | null
  personalNotes: string
  purchases: PerfumePurchase[]
  createdAt: string
  updatedAt: string
}

export type NewPerfume = Omit<
  Perfume,
  'id' | 'createdAt' | 'updatedAt'
>
