import { useState } from 'react';
import { suggestRecipes } from '../lib/api';

export default function Recipes() {
  const [input, setInput] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const ingredients = input
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);
      const data = await suggestRecipes(ingredients);
      setRecipes(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch recipes');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recipes</h2>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-1.5"
          placeholder="comma,separated,ingredients"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button disabled={busy} className="px-3 py-1.5 rounded bg-green-600 text-white disabled:opacity-50">
          Suggest
        </button>
      </form>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-3">
        {recipes.map((r, idx) => (
          <li key={r.title ?? idx} className="rounded border bg-white p-3">
            <h3 className="font-medium">{r.title ?? 'Recipe'}</h3>
            {Array.isArray(r.ingredients) && r.ingredients.length > 0 && (
              <ul className="list-disc ml-5 text-sm">
                {r.ingredients.map((ing: string, i: number) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            )}
            {Array.isArray(r.steps) && r.steps.length > 0 && (
              <ol className="list-decimal ml-5 text-sm mt-2">
                {r.steps.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}