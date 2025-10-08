import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';

export default function SignIn() {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h2 className="text-lg font-semibold">Sign In</h2>
      <button onClick={() => signInWithGoogle()} className="w-full rounded bg-red-600 text-white px-3 py-1.5">
        Continue with Google
      </button>
      <div className="text-center text-sm text-gray-500">or</div>
      <form onSubmit={onEmailSignIn} className="space-y-3">
        <input
          type="email"
          className="w-full rounded border px-3 py-1.5"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full rounded border px-3 py-1.5"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={busy} className="w-full rounded bg-blue-600 text-white px-3 py-1.5 disabled:opacity-50">
          Sign In
        </button>
      </form>
    </div>
  );
}