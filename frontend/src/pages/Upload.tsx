import { useEffect, useState } from 'react';
import { getUploadStatus, uploadImage } from '../lib/api';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function toBase64(f: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const imageBase64 = await toBase64(file);
      const { jobId } = await uploadImage(imageBase64, file.name);
      setJobId(jobId);
      setStatus(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!jobId) return;
    const t = setInterval(async () => {
      try {
        const s = await getUploadStatus(jobId);
        setStatus(s);
        if (s.state === 'completed' || s.state === 'failed') {
          clearInterval(t);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Polling failed');
        clearInterval(t);
      }
    }, 1500);
    return () => clearInterval(t);
  }, [jobId]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Upload OCR</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button
          disabled={!file || busy}
          className="px-3 py-1.5 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          Upload
        </button>
      </form>
      {error && <p className="text-red-600">{error}</p>}
      {jobId && <p className="text-sm">Job: {jobId}</p>}
      {status && (
        <pre className="text-xs whitespace-pre-wrap rounded bg-white border p-3">{JSON.stringify(status, null, 2)}</pre>
      )}
    </div>
  );
}