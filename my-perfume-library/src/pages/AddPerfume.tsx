
import { useEffect, useState, type FormEvent } from 'react'
import {Link, useNavigate, useParams } from 'react-router-dom'

import {
  addPerfume,
  DuplicatePerfumeError,
  getPerfumeById,
  updatePerfume,
} from '../services/perfumeStorage'

import type {
  Currency,
  FragranceFamily,
  Perfume,
  PerfumeConcentration,
  Season,
} from '../types/perfume'


interface PerfumeFormValues {
  name: string
  brand: string
  concentration: PerfumeConcentration
  fragranceFamily: FragranceFamily
  topNotes: string
  middleNotes: string
  baseNotes: string
  seasons: Season[]
  imageUrl: string
  description: string
  personalRating: number | ''
  personalNotes: string
  purchaseDate: string
  volumeMl: string
  unitPrice: string
  currency: Currency
  store: string
  quantityPurchased: string
  quantityRemaining: string
  purchaseNotes: string
}

const initialValues: PerfumeFormValues = {
  name: '',
  brand: '',
  concentration: 'Eau de Parfum',
  fragranceFamily: 'Floral',
  topNotes: '',
  middleNotes: '',
  baseNotes: '',
  seasons: [],
  imageUrl: '',
  description: '',
  personalRating: '',
  personalNotes: '',
  purchaseDate: new Date().toISOString().slice(0, 10),
  volumeMl: '',
  unitPrice: '',
  currency: 'EGP',
  store: '',
  quantityPurchased: '1',
  quantityRemaining: '1',
  purchaseNotes: '',
}

const inputClass =
  'mt-2 w-full rounded-lg border border-[#D8CCB8] bg-white px-4 py-3 text-sm text-[#49382B] outline-none transition placeholder:text-[#A69A89] focus:border-[#9B784B] focus:ring-2 focus:ring-[#9B784B]/15'

const labelClass = 'text-sm font-medium text-[#594535]'

const seasons: Season[] = [
  'Spring',
  'Summer',
  'Autumn',
  'Winter',
]

function parseNotes(value: string): string[] {
  return value
    .split(',')
    .map((note) => note.trim())
    .filter(Boolean)
}

function AddPerfume() {
//   const [form, setForm] = useState<PerfumeFormValues>(initialValues)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')

  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [form, setForm] = useState<PerfumeFormValues>(initialValues)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      return
    }

    const perfume = getPerfumeById(id)

    if (!perfume) {
      setNotFound(true)
      setIsLoading(false)
      return
    }

    const firstPurchase = perfume.purchases[0]

    setForm({
      name: perfume.name,
      brand: perfume.brand,
      concentration: perfume.concentration,
      fragranceFamily: perfume.fragranceFamily,
      topNotes: perfume.topNotes.join(', '),
      middleNotes: perfume.middleNotes.join(', '),
      baseNotes: perfume.baseNotes.join(', '),
      seasons: perfume.seasons,
      imageUrl: perfume.imageUrl,
      description: perfume.description,
      personalRating: perfume.personalRating ?? '',
      personalNotes: perfume.personalNotes,

      // بيانات الشراء لن يتم تعديلها في وضع Edit
      purchaseDate:
        firstPurchase?.purchaseDate ?? initialValues.purchaseDate,
      volumeMl: firstPurchase ? String(firstPurchase.volumeMl) : '',
      unitPrice: firstPurchase ? String(firstPurchase.unitPrice) : '',
      currency: firstPurchase?.currency ?? 'EGP',
      store: firstPurchase?.store ?? '',
      quantityPurchased: firstPurchase
        ? String(firstPurchase.quantityPurchased)
        : '1',
      quantityRemaining: firstPurchase
        ? String(firstPurchase.quantityRemaining)
        : '1',
      purchaseNotes: firstPurchase?.notes ?? '',
    })

    setIsLoading(false)
  }, [id])


  function updateField<K extends keyof PerfumeFormValues>(
    field: K,
    value: PerfumeFormValues[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
    setSuccess('')
  }

  function toggleSeason(season: Season) {
    const updatedSeasons = form.seasons.includes(season)
      ? form.seasons.filter((item) => item !== season)
      : [...form.seasons, season]

    updateField('seasons', updatedSeasons)
  }

  
function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  setError('')
  setSuccess('')

  const name = form.name.trim()
  const brand = form.brand.trim()
  const volumeMl = Number(form.volumeMl)
  const unitPrice = Number(form.unitPrice)
  const quantityPurchased = Number(form.quantityPurchased)
  const quantityRemaining = Number(form.quantityRemaining)

  if (!name || !brand) {
    setError('Please enter both the perfume name and brand.')
    return
  }

  // التحقق من بيانات الشراء مطلوب عند الإضافة فقط
  if (!isEditMode) {
    if (
      !Number.isFinite(volumeMl) ||
      volumeMl <= 0 ||
      !Number.isFinite(unitPrice) ||
      unitPrice < 0
    ) {
      setError('Enter a valid volume and a non-negative price.')
      return
    }

    if (
      !Number.isInteger(quantityPurchased) ||
      quantityPurchased < 1 ||
      !Number.isInteger(quantityRemaining) ||
      quantityRemaining < 0 ||
      quantityRemaining > quantityPurchased
    ) {
      setError('Please check the purchase quantities.')
      return
    }
  }

  const now = new Date().toISOString()

  try {
    if (isEditMode && id) {
      updatePerfume(id, {
        name,
        brand,
        concentration: form.concentration,
        fragranceFamily: form.fragranceFamily,
        topNotes: parseNotes(form.topNotes),
        middleNotes: parseNotes(form.middleNotes),
        baseNotes: parseNotes(form.baseNotes),
        seasons: form.seasons,
        imageUrl: form.imageUrl.trim(),
        description: form.description.trim(),
        personalRating:
          form.personalRating === '' ? null : form.personalRating,
        personalNotes: form.personalNotes.trim(),
      })

      setSuccess('Perfume details updated successfully!')
      return
    }

    const perfume: Perfume = {
      id: crypto.randomUUID(),
      name,
      brand,
      concentration: form.concentration,
      fragranceFamily: form.fragranceFamily,
      topNotes: parseNotes(form.topNotes),
      middleNotes: parseNotes(form.middleNotes),
      baseNotes: parseNotes(form.baseNotes),
      seasons: form.seasons,
      imageUrl: form.imageUrl.trim(),
      description: form.description.trim(),
      personalRating:
        form.personalRating === '' ? null : form.personalRating,
      personalNotes: form.personalNotes.trim(),
      purchases: [
        {
          id: crypto.randomUUID(),
          purchaseDate: form.purchaseDate,
          volumeMl,
          unitPrice,
          currency: form.currency,
          store: form.store.trim(),
          quantityPurchased,
          quantityRemaining,
          notes: form.purchaseNotes.trim(),
        },
      ],
      createdAt: now,
      updatedAt: now,
    }

    addPerfume(perfume)

    setSuccess(`${brand} ${name} was added successfully!`)
    setForm({
      ...initialValues,
      purchaseDate: new Date().toISOString().slice(0, 10),
    })
  } catch (error) {
    if (error instanceof DuplicatePerfumeError) {
      setError(
        'Another perfume with the same name and brand already exists.',
      )
    } else {
      setError('Could not save the perfume. Please try again.')
    }
  }
}

if (isLoading) {
  return (
    <main className="min-h-screen bg-[#F7F3EC] p-10 text-center">
      Loading perfume details...
    </main>
  )
}

if (notFound) {
  return (
    <main className="min-h-screen bg-[#F7F3EC] p-10 text-center">
      <h1 className="font-serif text-3xl text-[#594535]">
        Perfume not found
      </h1>

      <p className="mt-3 text-[#827465]">
        The perfume may have been deleted or the link is incorrect.
      </p>

      <Link
        to="/perfumes"
        className="mt-6 inline-block rounded-lg bg-[#795735] px-5 py-3 text-white"
      >
        Back to My Collection
      </Link>
    </main>
  )
}


  return (
    <main className="min-h-screen bg-[#F7F3EC] px-4 py-10 text-[#49382B] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9B784B]">
            Your personal fragrance collection
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
            {isEditMode ? 'Edit Perfume' : 'Add a New Perfume'}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#827465]">
            Keep every fragrance, purchase, and personal note in one
            beautiful place.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-[#E6DDCF] bg-[#FFFDFA] p-5 shadow-sm sm:p-8">
            <SectionHeading number="01" title="Perfume Information" />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Perfume Name *
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g. Libre"
                  required
                />
              </label>

              <label className={labelClass}>
                Brand *
                <input
                  className={inputClass}
                  value={form.brand}
                  onChange={(e) => updateField('brand', e.target.value)}
                  placeholder="e.g. Yves Saint Laurent"
                  required
                />
              </label>

              <label className={labelClass}>
                Concentration
                <select
                  className={inputClass}
                  value={form.concentration}
                  onChange={(e) =>
                    updateField(
                      'concentration',
                      e.target.value as PerfumeConcentration,
                    )
                  }
                >
                  <option value="Parfum">Parfum</option>
                  <option value="Eau de Parfum">Eau de Parfum</option>
                  <option value="Eau de Toilette">Eau de Toilette</option>
                  <option value="Eau de Cologne">Eau de Cologne</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className={labelClass}>
                Fragrance Family
                <select
                  className={inputClass}
                  value={form.fragranceFamily}
                  onChange={(e) =>
                    updateField(
                      'fragranceFamily',
                      e.target.value as FragranceFamily,
                    )
                  }
                >
                  <option value="Floral">Floral</option>
                  <option value="Woody">Woody</option>
                  <option value="Fresh">Fresh</option>
                  <option value="Oriental">Oriental</option>
                  <option value="Citrus">Citrus</option>
                  <option value="Fruity">Fruity</option>
                  <option value="Gourmand">Gourmand</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className={`${labelClass} sm:col-span-2`}>
                Description
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    updateField('description', e.target.value)
                  }
                  placeholder="Describe the fragrance..."
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E6DDCF] bg-[#FFFDFA] p-5 shadow-sm sm:p-8">
            <SectionHeading number="02" title="Fragrance Profile" />

            <p className="mt-2 text-sm text-[#827465]">
              Separate notes with commas, for example: Rose, Jasmine, Musk.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <label className={labelClass}>
                Top Notes
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.topNotes}
                  onChange={(e) => updateField('topNotes', e.target.value)}
                  placeholder="Bergamot, Lemon"
                />
              </label>

              <label className={labelClass}>
                Middle Notes
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.middleNotes}
                  onChange={(e) => updateField('middleNotes', e.target.value)}
                  placeholder="Rose, Jasmine"
                />
              </label>

              <label className={labelClass}>
                Base Notes
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.baseNotes}
                  onChange={(e) => updateField('baseNotes', e.target.value)}
                  placeholder="Vanilla, Musk"
                />
              </label>
            </div>

            <fieldset className="mt-6">
              <legend className={labelClass}>Best Seasons</legend>

              <div className="mt-3 flex flex-wrap gap-3">
                {seasons.map((season) => (
                  <label
                    key={season}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition ${
                      form.seasons.includes(season)
                        ? 'border-[#8B6B43] bg-[#8B6B43] text-white'
                        : 'border-[#D8CCB8] bg-white text-[#594535] hover:border-[#9B784B]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={form.seasons.includes(season)}
                      onChange={() => toggleSeason(season)}
                    />
                    {season}
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          <section className="rounded-2xl border border-[#E6DDCF] bg-[#FFFDFA] p-5 shadow-sm sm:p-8">
            <SectionHeading number="03" title="My Experience" />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Personal Rating
                <select
                  className={inputClass}
                  value={form.personalRating}
                  onChange={(e) =>
                    updateField(
                      'personalRating',
                      e.target.value === '' ? '' : Number(e.target.value),
                    )
                  }
                >
                  <option value="">Not rated yet</option>
                  <option value="1">1 / 5</option>
                  <option value="2">2 / 5</option>
                  <option value="3">3 / 5</option>
                  <option value="4">4 / 5</option>
                  <option value="5">5 / 5</option>
                </select>
              </label>

              <label className={labelClass}>
                Personal Notes
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.personalNotes}
                  onChange={(e) =>
                    updateField('personalNotes', e.target.value)
                  }
                  placeholder="Longevity, projection, occasions..."
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E6DDCF] bg-[#FFFDFA] p-5 shadow-sm sm:p-8">
            <SectionHeading number="04" title="First Purchase" />

            <p className="mt-2 text-sm text-[#827465]">
              You can record more purchases for this perfume later.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Purchase Date *
                <input
                  type="date"
                  className={inputClass}
                  value={form.purchaseDate}
                  onChange={(e) =>
                    updateField('purchaseDate', e.target.value)
                  }
                  required
                />
              </label>

              <label className={labelClass}>
                Bottle Volume (ml) *
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  className={inputClass}
                  value={form.volumeMl}
                  onChange={(e) => updateField('volumeMl', e.target.value)}
                  placeholder="e.g. 100"
                  required
                />
              </label>

              <label className={labelClass}>
                Unit Price *
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.unitPrice}
                  onChange={(e) => updateField('unitPrice', e.target.value)}
                  placeholder="e.g. 3500"
                  required
                />
              </label>

              <label className={labelClass}>
                Currency
                <select
                  className={inputClass}
                  value={form.currency}
                  onChange={(e) =>
                    updateField('currency', e.target.value as Currency)
                  }
                >
                  <option value="EGP">EGP - Egyptian Pound</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className={labelClass}>
                Store
                <input
                  className={inputClass}
                  value={form.store}
                  onChange={(e) => updateField('store', e.target.value)}
                  placeholder="Where did you buy it?"
                />
              </label>

              <label className={labelClass}>
                Quantity Purchased *
                <input
                  type="number"
                  min="1"
                  step="1"
                  className={inputClass}
                  value={form.quantityPurchased}
                  onChange={(e) =>
                    updateField('quantityPurchased', e.target.value)
                  }
                  required
                />
              </label>

              <label className={labelClass}>
                Quantity Remaining *
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={inputClass}
                  value={form.quantityRemaining}
                  onChange={(e) =>
                    updateField('quantityRemaining', e.target.value)
                  }
                  required
                />
              </label>

              <label className={`${labelClass} sm:col-span-2`}>
                Purchase Notes
                <textarea
                  className={inputClass}
                  rows={2}
                  value={form.purchaseNotes}
                  onChange={(e) =>
                    updateField('purchaseNotes', e.target.value)
                  }
                  placeholder="Discount, gift, batch details..."
                />
              </label>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
            >
              {success}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setForm(initialValues)
                setError('')
                setSuccess('')
              }}
              className="rounded-lg border border-[#CDBDA7] px-6 py-3 text-sm font-medium text-[#594535] transition hover:bg-[#EEE5D8]"
            >
              Clear Form
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#795735] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#604329]"
            >
              {isEditMode ? 'Update Perfume' : 'Save Perfume'}
            </button>

            <button
  type="button"
  onClick={() =>
    navigate(isEditMode && id ? `/perfumes/${id}` : '/perfumes')
  }
  className="rounded-lg border border-[#CDBDA7] px-6 py-3 text-sm font-medium text-[#594535] hover:bg-[#EEE5D8]"
>
  Cancel
</button>
          </div>
        </form>
      </div>
    </main>
  )
}

interface SectionHeadingProps {
  number: string
  title: string
}

function SectionHeading({ number, title }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-serif text-sm text-[#A1845B]">{number}</span>
      <div>
        <h2 className="font-serif text-xl font-semibold text-[#49382B]">
          {title}
        </h2>
        <div className="mt-2 h-px w-14 bg-[#C5A16A]" />
      </div>
    </div>
  )
}

export default AddPerfume
