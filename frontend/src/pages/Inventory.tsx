import { useEffect, useState } from 'react';
import { getInventory } from '../lib/api';

export default function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setItems(await getInventory());
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load inventory');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Inventory</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((it, idx) => (
          <li key={it.id ?? idx} className="rounded border bg-white p-3">
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(it, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}