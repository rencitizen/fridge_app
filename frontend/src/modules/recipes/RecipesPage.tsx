import React from 'react';
import { apiClient } from '../../shared/apiClient';

type Recipe = { id?: string; title: string };

export function RecipesPage(): JSX.Element {
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  async function fetchRecipes(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ recipes: Recipe[] }>('/api/recipes/suggest');
      setRecipes(res.data.recipes);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Recipes</h2>
      <button onClick={fetchRecipes} disabled={loading}>
        {loading ? 'Loading…' : 'Suggest recipes'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <ul style={{ marginTop: 12 }}>
        {recipes.map((r, i) => (
          <li key={r.id ?? i}>{r.title}</li>
        ))}
      </ul>
    </div>
  );
}

