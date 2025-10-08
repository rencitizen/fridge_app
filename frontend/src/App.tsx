import { Link, Route, Routes, Navigate } from 'react-router-dom';
import Inventory from './pages/Inventory';
import Upload from './pages/Upload';
import Recipes from './pages/Recipes';
import SignIn from './pages/SignIn';
import Protected from './components/Protected';

export default function App() {
  return (
    <div className="min-h-full">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
          <h1 className="font-semibold">Smart Refrigerator</h1>
          <nav className="flex gap-3 text-sm">
            <Link to="/inventory" className="hover:underline">Inventory</Link>
            <Link to="/upload" className="hover:underline">Upload</Link>
            <Link to="/recipes" className="hover:underline">Recipes</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/inventory"
            element={
              <Protected>
                <Inventory />
              </Protected>
            }
          />
          <Route
            path="/upload"
            element={
              <Protected>
                <Upload />
              </Protected>
            }
          />
          <Route
            path="/recipes"
            element={
              <Protected>
                <Recipes />
              </Protected>
            }
          />
        </Routes>
      </main>
    </div>
  );
}