
import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <section className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9B784B]">
            A fragrance journal
          </p>

          <h1 className="mt-5 max-w-xl font-serif text-5xl leading-tight sm:text-6xl">
            Every scent tells a story.
          </h1>

          <p className="mt-6 max-w-lg leading-8 text-[#827465]">
            Keep your favorite fragrances, purchase history, and personal
            notes in one elegant collection.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/perfumes"
              className="rounded-lg bg-[#795735] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#604329]"
            >
              Explore My Collection
            </Link>

            <Link
              to="/add-perfume"
              className="rounded-lg border border-[#CDBDA7] px-6 py-3 text-sm font-medium hover:bg-[#EEE5D8]"
            >
              Add a Perfume
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-[#E6DDCF] bg-[#E9DFD0] p-8 sm:p-12">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#C5A16A]/50" />
          <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full border border-[#C5A16A]/50" />

          <div className="relative flex min-h-72 flex-col items-center justify-center text-center">
            <span className="text-xs uppercase tracking-[0.35em] text-[#8B6B43]">
              Your signature collection
            </span>

            <div className="my-8 flex h-36 w-28 items-center justify-center rounded-t-3xl rounded-b-xl border border-[#B49A75] bg-[#F7F3EC] shadow-xl">
              <div className="flex h-20 w-20 items-center justify-center border border-[#C5A16A] text-center font-serif text-2xl text-[#795735]">
                M
              </div>
            </div>

            <p className="font-serif text-2xl italic text-[#604329]">
              Memories in a bottle
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
