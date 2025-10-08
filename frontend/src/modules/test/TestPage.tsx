import React from 'react';
import { apiClient } from '../../shared/apiClient';

export function TestPage(): JSX.Element {
  const [output, setOutput] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  async function run<T>(fn: () => Promise<T>): Promise<void> {
    setLoading(true);
    setOutput('');
    try {
      const res = await fn();
      setOutput(JSON.stringify(res, null, 2));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setOutput(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Test Console</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button disabled={loading} onClick={() => run(() => apiClient.get('/health'))}>Health</button>
        <button disabled={loading} onClick={() => run(() => apiClient.get('/api/inventory'))}>Inventory</button>
        <button disabled={loading} onClick={() => run(() => apiClient.get('/api/recipes/suggest'))}>Recipes</button>
        <button
          disabled={loading}
          onClick={() =>
            run(() => apiClient.post('/api/upload', { imageBase64: 'data:image/png;base64,AAAA' }))
          }
        >
          Upload (dummy)
        </button>
      </div>
      <pre style={{ marginTop: 12, background: '#f6f8fa', padding: 12, borderRadius: 6, overflowX: 'auto' }}>
{output || (loading ? 'Loading…' : 'No output yet.')}
      </pre>
    </div>
  );
}

