
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  addPurchase,
  getPerfumeById,
} from '../services/perfumeStorage'
import type { Currency, Perfume, PerfumePurchase } from '../types/perfume'

function PerfumeDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [perfume, setPerfume] = useState<Perfume | undefined>(
    () => (id ? getPerfumeById(id) : undefined),
  )

  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().slice(0, 10),
  )
  const [volumeMl, setVolumeMl] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [currency, setCurrency] = useState<Currency>('EGP')
  const [store, setStore] = useState('')
  const [quantityPurchased, setQuantityPurchased] = useState('1')
  const [quantityRemaining, setQuantityRemaining] = useState('1')
  const [purchaseNotes, setPurchaseNotes] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!perfume || !id) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl">Perfume not found</h1>
        <p className="mt-3 text-[#827465]">
          This perfume may have been deleted or the link may be incorrect.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/perfumes"
            className="text-sm text-[#8B6B43] hover:underline"
          >
            ← Back to My Collection
          </Link>

          
          
        </div>
      </main>
    )
  }

  function handleAddPurchase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const volume = Number(volumeMl)
    const price = Number(unitPrice)
    const purchased = Number(quantityPurchased)
    const remaining = Number(quantityRemaining)

    if (!Number.isFinite(volume) || volume <= 0) {
      setError('Enter a valid bottle volume.')
      return
    }

    if (!Number.isFinite(price) || price < 0) {
      setError('Enter a valid, non-negative price.')
      return
    }

    if (
      !Number.isInteger(purchased) ||
      purchased < 1 ||
      !Number.isInteger(remaining) ||
      remaining < 0 ||
      remaining > purchased
    ) {
      setError('Please check the purchased and remaining quantities.')
      return
    }

    const purchase: Omit<PerfumePurchase, 'id'> = {
      purchaseDate,
      volumeMl: volume,
      unitPrice: price,
      currency,
      store: store.trim(),
      quantityPurchased: purchased,
      quantityRemaining: remaining,
      notes: purchaseNotes.trim(),
    }

    if (!id) {
      setError('Perfume not found. Please return to your collection.')
      return
    }

    try {
      const updated = addPurchase(id, purchase)
      setPerfume(updated)
      setVolumeMl('')
      setUnitPrice('')
      setStore('')
      setQuantityPurchased('1')
      setQuantityRemaining('1')
      setPurchaseNotes('')
      setPurchaseDate(new Date().toISOString().slice(0, 10))
      setSuccess('Purchase added successfully!')
    } catch {
      setError('Could not add the purchase. Please try again.')
    }
  }

  const totalRemaining = perfume.purchases.reduce(
    (total, purchase) => total + purchase.quantityRemaining,
    0,
  )

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/perfumes"
        className="text-sm text-[#8B6B43] hover:underline"
      >
        ← Back to My Collection
      </Link>
<br></br>
<br></br>
            <Link
              to={`/perfumes/${perfume.id}/edit`}
              className="rounded-lg border border-[#CDBDA7] px-5 py-2.5 text-sm font-semibold text-[#795735] transition hover:bg-[#EEE5D8]"
            >
              Edit Perfume
            </Link>

      <section className="mt-6 grid gap-8 rounded-2xl border border-[#E6DDCF] bg-[#FFFDFA] p-5 shadow-sm sm:p-8 md:grid-cols-2">
        <div className="flex min-h-72 items-center justify-center rounded-xl bg-[#E9DFD0]">
          {perfume.imageUrl ? (
            <img
              src={perfume.imageUrl}
              alt={`${perfume.brand} ${perfume.name}`}
              className="max-h-80 w-full object-contain p-4"
            />
          ) : (
            <div className="flex h-40 w-28 items-center justify-center rounded-t-3xl rounded-b-xl border border-[#B49A75] bg-[#F7F3EC] font-serif text-4xl text-[#795735]">
              {perfume.brand.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#9B784B]">
            {perfume.brand}
          </p>

          <h1 className="mt-3 font-serif text-4xl">
            {perfume.name}
          </h1>

          <p className="mt-3 text-sm text-[#827465]">
            {perfume.concentration} · {perfume.fragranceFamily}
          </p>

          {perfume.description && (
            <p className="mt-5 leading-7 text-[#6F5E4C]">
              {perfume.description}
            </p>
          )}

          {perfume.personalRating !== null && (
            <p className="mt-4 text-sm text-[#795735]">
              Personal rating: {perfume.personalRating}/5
            </p>
          )}

          {perfume.personalNotes && (
            <p className="mt-3 text-sm leading-6 text-[#827465]">
              <span className="font-semibold text-[#594535]">
                My notes:
              </span>{' '}
              {perfume.personalNotes}
            </p>
          )}

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { title: 'Top Notes', notes: perfume.topNotes },
              { title: 'Heart Notes', notes: perfume.middleNotes },
              { title: 'Base Notes', notes: perfume.baseNotes },
            ].map((group) => (
              <div
                key={group.title}
                className="rounded-lg bg-[#F7F3EC] p-3"
              >
                <p className="text-xs font-semibold text-[#795735]">
                  {group.title}
                </p>
                <p className="mt-2 text-xs leading-5 text-[#827465]">
                  {group.notes.length
                    ? group.notes.join(', ')
                    : 'Not added'}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm text-[#827465]">
            Seasons: {perfume.seasons.length
              ? perfume.seasons.join(', ')
              : 'Not specified'}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[#E6DDCF] bg-[#FFFDFA] p-5 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#9B784B]">
              Purchase history
            </p>
            <h2 className="mt-2 font-serif text-2xl">
              Your Purchases
            </h2>
          </div>

          <p className="text-sm text-[#827465]">
            Bottles remaining: <strong>{totalRemaining}</strong>
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {perfume.purchases.map((purchase, index) => (
            <article
              key={purchase.id}
              className="rounded-xl border border-[#E6DDCF] p-4"
            >
              <div className="flex flex-wrap justify-between gap-3">
                <h3 className="font-semibold">
                  Purchase #{index + 1}
                </h3>
                <span className="text-sm text-[#8B6B43]">
                  {purchase.purchaseDate}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-[#827465]">Volume</p>
                  <p className="mt-1 font-medium">{purchase.volumeMl} ml</p>
                </div>
                <div>
                  <p className="text-[#827465]">Unit price</p>
                  <p className="mt-1 font-medium">
                    {purchase.unitPrice.toLocaleString()} {purchase.currency}
                  </p>
                </div>
                <div>
                  <p className="text-[#827465]">Purchased</p>
                  <p className="mt-1 font-medium">
                    {purchase.quantityPurchased}
                  </p>
                </div>
                <div>
                  <p className="text-[#827465]">Remaining</p>
                  <p className="mt-1 font-medium">
                    {purchase.quantityRemaining}
                  </p>
                </div>
              </div>

              {purchase.store && (
                <p className="mt-3 text-sm text-[#827465]">
                  Store: {purchase.store}
                </p>
              )}

              {purchase.notes && (
                <p className="mt-2 text-sm text-[#827465]">
                  Notes: {purchase.notes}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[#E6DDCF] bg-[#FFFDFA] p-5 sm:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#9B784B]">
          Collection update
        </p>

        <h2 className="mt-2 font-serif text-2xl">
          Add Another Purchase
        </h2>

        <p className="mt-2 text-sm text-[#827465]">
          Add another bottle or a different size without creating a duplicate perfume.
        </p>

        <form onSubmit={handleAddPurchase} className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Purchase Date *
            <input
              type="date"
              className="mt-2 w-full rounded-lg border border-[#D8CCB8] bg-white px-4 py-3"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </label>

          <label className="text-sm font-medium">
            Volume (ml) *
            <input
              type="number"
              min="0.1"
              step="any"
              className="mt-2 w-full rounded-lg border border-[#D8CCB8] bg-white px-4 py-3"
              value={volumeMl}
              onChange={(e) => setVolumeMl(e.target.value)}
              required
            />
          </label>

          <label className="text-sm font-medium">
            Unit Price *
            <input
              type="number"
              min="0"
              step="0.01"
              className="mt-2 w-full rounded-lg border border-[#D8CCB8] bg-white px-4 py-3"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              required
            />
          </label>

          <label className="text-sm font-medium">
            Currency
            <select
              className="mt-2 w-full rounded-lg border border-[#D8CCB8] bg-white px-4 py-3"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
            >
              <option value="EGP">EGP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="text-sm font-medium">
            Quantity Purchased *
            <input
              type="number"
              min="1"
              step="1"
              className="mt-2 w-full rounded-lg border border-[#D8CCB8] bg-white px-4 py-3"
              value={quantityPurchased}
              onChange={(e) => setQuantityPurchased(e.target.value)}
              required
            />
          </label>

          <label className="text-sm font-medium">
            Quantity Remaining *
            <input
              type="number"
              min="0"
              step="1"
              className="mt-2 w-full rounded-lg border border-[#D8CCB8] bg-white px-4 py-3"
              value={quantityRemaining}
              onChange={(e) => setQuantityRemaining(e.target.value)}
              required
            />
          </label>

          <label className="text-sm font-medium sm:col-span-2">
            Store
            <input
              className="mt-2 w-full rounded-lg border border-[#D8CCB8] bg-white px-4 py-3"
              value={store}
              onChange={(e) => setStore(e.target.value)}
              placeholder="Store name"
            />
          </label>

          <label className="text-sm font-medium sm:col-span-2">
            Purchase Notes
            <textarea
              rows={2}
              className="mt-2 w-full rounded-lg border border-[#D8CCB8] bg-white px-4 py-3"
              value={purchaseNotes}
              onChange={(e) => setPurchaseNotes(e.target.value)}
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-700 sm:col-span-2">
              {error}
            </p>
          )}

          {success && (
            <p role="status" className="text-sm text-green-800 sm:col-span-2">
              {success}
            </p>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-[#795735] px-6 py-3 text-sm font-semibold text-white hover:bg-[#604329]"
            >
              Save Purchase
            </button>
          </div>
        </form>
      </section>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => navigate('/perfumes')}
          className="text-sm text-[#8B6B43] hover:underline"
        >
          Return to collection
        </button>
      </div>
    </main>
  )
}

export default PerfumeDetails
