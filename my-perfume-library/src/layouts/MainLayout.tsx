
import { NavLink, Outlet } from 'react-router-dom'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition ${
    isActive
      ? 'font-semibold text-[#8B6B43]'
      : 'text-[#796B5B] hover:text-[#49382B]'
  }`

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#49382B]">
      <header className="sticky top-0 z-20 border-b border-[#E6DDCF] bg-[#FFFDFA]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="shrink-0">
            <span className="block font-serif text-xl font-semibold tracking-wide sm:text-2xl">
              Ahmed
            </span>
            <span className="block text-[9px] uppercase tracking-[0.3em] text-[#9B784B]">
              Perfume Library
            </span>
          </NavLink>

          <div className="flex flex-wrap items-center justify-end gap-4 sm:gap-7">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>

            <NavLink to="/perfumes" className={navClass}>
              My Collection
            </NavLink>

            <NavLink
              to="/add-perfume"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition sm:px-4 ${
                  isActive
                    ? 'bg-[#604329] text-white'
                    : 'bg-[#795735] text-white hover:bg-[#604329]'
                }`
              }
            >
              + Add Perfume
            </NavLink>
          </div>
        </nav>
      </header>

      <Outlet />

      <footer className="mt-12 border-t border-[#E6DDCF] px-4 py-6 text-center text-xs tracking-wide text-[#8C7D6D]">
        A personal home for every fragrance you love.
      </footer>
    </div>
  )
}

export default MainLayout
