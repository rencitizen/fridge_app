import React from 'react';
import { apiClient } from '../../shared/apiClient';

type InventoryItem = { id: string; name: string; quantity: number };

export function InventoryPage(): JSX.Element {
  const [items, setItems] = React.useState<InventoryItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiClient
      .get<{ items: InventoryItem[] }>('/api/inventory')
      .then((res) => {
        if (!isMounted) return;
        setItems(res.data.items);
      })
      .catch((e: Error) => {
        if (!isMounted) return;
        setError(e.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Inventory</h2>
      {items.length === 0 ? (
        <div>No items yet.</div>
      ) : (
        <ul>
          {items.map((it) => (
            <li key={it.id}>
              {it.name} — {it.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

