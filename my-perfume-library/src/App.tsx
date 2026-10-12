
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import PerfumeLibrary from './pages/PerfumeLibrary'
import AddPerfume from './pages/AddPerfume'
import PerfumeDetails from './pages/PerfumeDetails'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/perfumes" element={<PerfumeLibrary />} />
        <Route path="/add-perfume" element={<AddPerfume />} />
        <Route path="/perfumes/:id/edit" element={<AddPerfume />} />
        <Route path="/perfumes/:id" element={<PerfumeDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
