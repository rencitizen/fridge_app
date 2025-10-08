import React from 'react';
import { apiClient } from '../../shared/apiClient';

export function UploadPage(): JSX.Element {
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!file) return;
    setError(null);
    setStatus('Uploading…');
    try {
      const base64 = await fileToBase64(file);
      const res = await apiClient.post<{ jobId: string }>(
        '/api/upload',
        { imageBase64: base64 },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setStatus(`Enqueued job ${res.data.jobId}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      setError(msg);
      setStatus('');
    }
  }

  return (
    <div>
      <h2>Upload Receipt</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button type="submit" disabled={!file} style={{ marginLeft: 8 }}>
          Upload
        </button>
      </form>
      {status && <div style={{ marginTop: 8 }}>{status}</div>}
      {error && (
        <div style={{ marginTop: 8, color: 'red' }}>
          {error}
        </div>
      )}
    </div>
  );
}

function fileToBase64(f: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(f);
  });
}

