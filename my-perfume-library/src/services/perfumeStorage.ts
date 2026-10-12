import type {
  Perfume,
  PerfumePurchase,
} from '../types/perfume'

const STORAGE_KEY = 'my-perfume-library'

export class DuplicatePerfumeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DuplicatePerfumeError'
  }
}

export function getPerfumes(): Perfume[] {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY)

    if (!storedData) {
      return []
    }

    const perfumes: unknown = JSON.parse(storedData)

    if (!Array.isArray(perfumes)) {
      return []
    }

    return perfumes as Perfume[]
  } catch (error) {
    console.error('Failed to load perfumes:', error)
    return []
  }
}

export function savePerfumes(perfumes: Perfume[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(perfumes))
}

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

export function getPerfumeById(
  id: string,
): Perfume | undefined {
  return getPerfumes().find((perfume) => perfume.id === id)
}

export function findDuplicatePerfume(
  name: string,
  brand: string,
): Perfume | undefined {
  return getPerfumes().find(
    (perfume) =>
      normalize(perfume.name) === normalize(name) &&
      normalize(perfume.brand) === normalize(brand),
  )
}

export function addPerfume(perfume: Perfume): void {
  const perfumes = getPerfumes()

  const duplicate = perfumes.find(
    (item) =>
      normalize(item.name) === normalize(perfume.name) &&
      normalize(item.brand) === normalize(perfume.brand),
  )

  if (duplicate) {
    throw new DuplicatePerfumeError(
      `${duplicate.brand} ${duplicate.name} already exists.`,
    )
  }

  savePerfumes([...perfumes, perfume])
}

export function addPurchase(
  perfumeId: string,
  purchase: Omit<PerfumePurchase, 'id'>,
): Perfume {
  const perfumes = getPerfumes()
  const index = perfumes.findIndex(
    (perfume) => perfume.id === perfumeId,
  )

  if (index === -1) {
    throw new Error('Perfume not found.')
  }

  const current = perfumes[index]

  const updatedPerfume: Perfume = {
    ...current,
    purchases: [
      ...current.purchases,
      {
        ...purchase,
        id: crypto.randomUUID(),
      },
    ],
    updatedAt: new Date().toISOString(),
  }

  const updatedPerfumes = [...perfumes]
  updatedPerfumes[index] = updatedPerfume

  savePerfumes(updatedPerfumes)

  return updatedPerfume
}

export function updatePerfume(
  id: string,
  updates: Partial<
    Omit<Perfume, 'id' | 'createdAt' | 'purchases'>
  >,
): Perfume {
  const perfumes = getPerfumes()

  const index = perfumes.findIndex(
    (perfume) => perfume.id === id,
  )

  if (index === -1) {
    throw new Error('Perfume not found.')
  }

  const current = perfumes[index]

  const updatedPerfume: Perfume = {
    ...current,
    ...updates,
    id: current.id,
    createdAt: current.createdAt,
    purchases: current.purchases,
    updatedAt: new Date().toISOString(),
  }

  const duplicate = perfumes.some(
    (perfume) =>
      perfume.id !== id &&
      normalize(perfume.name) === normalize(updatedPerfume.name) &&
      normalize(perfume.brand) === normalize(updatedPerfume.brand),
  )

  if (duplicate) {
    throw new DuplicatePerfumeError(
      'Another perfume with the same name and brand already exists.',
    )
  }

  const updatedPerfumes = [...perfumes]
  updatedPerfumes[index] = updatedPerfume

  savePerfumes(updatedPerfumes)

  return updatedPerfume
}

export function deletePerfume(id: string): void {
  const perfumes = getPerfumes()
  const updatedPerfumes = perfumes.filter(
    (perfume) => perfume.id !== id,
  )

  savePerfumes(updatedPerfumes)
}
