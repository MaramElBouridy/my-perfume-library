
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { deletePerfume, getPerfumes } from '../services/perfumeStorage'
import type { Perfume } from '../types/perfume'

function PerfumeLibrary() {
  const [perfumes, setPerfumes] = useState<Perfume[]>(getPerfumes)
  const [search, setSearch] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const filteredPerfumes = perfumes.filter((perfume) => {
    const query = search.trim().toLowerCase()

    return (
      perfume.name.toLowerCase().includes(query) ||
      perfume.brand.toLowerCase().includes(query)
    )
  })

  function handleDelete(perfume: Perfume) {
    const confirmed = window.confirm(
      `Delete ${perfume.brand} ${perfume.name} and its purchase history?`,
    )

    if (!confirmed) {
      return
    }

    try {
      deletePerfume(perfume.id)
      setPerfumes((current) =>
        current.filter((item) => item.id !== perfume.id),
      )
      setDeleteError('')
    } catch {
      setDeleteError('Could not delete this perfume. Please try again.')
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#9B784B]">
            Your collection
          </p>

          <h1 className="mt-3 font-serif text-4xl font-semibold">
            My Perfumes
          </h1>

          <p className="mt-3 text-sm text-[#827465]">
            {perfumes.length} {perfumes.length === 1 ? 'perfume' : 'perfumes'} in your library
          </p>
        </div>

        <Link
          to="/add-perfume"
          className="inline-flex items-center justify-center rounded-lg bg-[#795735] px-5 py-3 text-sm font-semibold text-white hover:bg-[#604329]"
        >
          + Add New Perfume
        </Link>
      </div>

      <div className="mt-8">
        <label className="block text-sm font-medium text-[#594535]">
          Search your collection
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by perfume name or brand..."
            className="mt-2 w-full rounded-xl border border-[#D8CCB8] bg-[#FFFDFA] px-4 py-3 outline-none focus:border-[#9B784B] sm:max-w-xl"
          />
        </label>
      </div>

      {deleteError && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {deleteError}
        </p>
      )}

      {filteredPerfumes.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[#CDBDA7] bg-[#FFFDFA] px-6 py-16 text-center">
          <h2 className="font-serif text-2xl">
            {perfumes.length === 0
              ? 'Your collection starts here'
              : 'No matching perfumes'}
          </h2>

          <p className="mt-3 text-sm text-[#827465]">
            {perfumes.length === 0
              ? 'Add your first fragrance to start building your library.'
              : 'Try another name or brand.'}
          </p>

          {perfumes.length === 0 && (
            <Link
              to="/add-perfume"
              className="mt-6 inline-block rounded-lg bg-[#795735] px-5 py-3 text-sm font-semibold text-white"
            >
              Add Your First Perfume
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPerfumes.map((perfume) => {
            const totalRemaining = perfume.purchases.reduce(
              (total, purchase) => total + purchase.quantityRemaining,
              0,
            )

            return (
              <article
                key={perfume.id}
                className="overflow-hidden rounded-2xl border border-[#E6DDCF] bg-[#FFFDFA] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-52 items-center justify-center bg-[#E9DFD0]">
                  {perfume.imageUrl ? (
                    <img
                      src={perfume.imageUrl}
                      alt={`${perfume.brand} ${perfume.name}`}
                      className="h-full w-full object-contain p-4"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="flex h-32 w-24 items-center justify-center rounded-t-2xl rounded-b-lg border border-[#B49A75] bg-[#F7F3EC] font-serif text-3xl text-[#795735]">
                      {perfume.brand.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9B784B]">
                    {perfume.brand}
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    {perfume.name}
                  </h2>

                  <p className="mt-2 text-sm text-[#827465]">
                    {perfume.concentration} · {perfume.fragranceFamily}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {perfume.seasons.map((season) => (
                      <span
                        key={season}
                        className="rounded-full bg-[#EEE5D8] px-3 py-1 text-xs text-[#604329]"
                      >
                        {season}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#E6DDCF] pt-4 text-sm">
                    <span className="text-[#827465]">
                      Bottles remaining
                    </span>
                    <span className="font-semibold">{totalRemaining}</span>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <Link
                      to={`/perfumes/${perfume.id}`}
                      className="flex-1 rounded-lg bg-[#795735] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#604329]"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(perfume)}
                      aria-label={`Delete ${perfume.name}`}
                      className="rounded-lg border border-[#D8CCB8] px-4 py-3 text-sm text-[#795735] hover:bg-[#F1E5E0] hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default PerfumeLibrary
