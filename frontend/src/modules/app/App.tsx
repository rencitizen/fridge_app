import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function App(): JSX.Element {
  const location = useLocation();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <header style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>PantrySync</h1>
        <nav style={{ display: 'flex', gap: 12 }}>
          <NavLink to="/" label="Inventory" currentPath={location.pathname} />
          <NavLink to="/upload" label="Upload" currentPath={location.pathname} />
          <NavLink to="/recipes" label="Recipes" currentPath={location.pathname} />
          <NavLink to="/test" label="Test" currentPath={location.pathname} />
        </nav>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: '#666' }}>
          <HealthBadge />
        </div>
      </header>
      <main style={{ marginTop: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}

function NavLink(props: { to: string; label: string; currentPath: string }): JSX.Element {
  const isActive = props.to === '/' ? props.currentPath === '/' : props.currentPath.startsWith(props.to);
  return (
    <Link
      to={props.to}
      style={{
        textDecoration: 'none',
        color: isActive ? '#0b5fff' : '#333',
        fontWeight: isActive ? 700 : 500
      }}
    >
      {props.label}
    </Link>
  );
}

function HealthBadge(): JSX.Element {
  const [status, setStatus] = React.useState<'ok' | 'down' | 'pending'>('pending');

  React.useEffect(() => {
    let isMounted = true;
    fetch('/health')
      .then(async (r) => {
        if (!r.ok) throw new Error('health failed');
        const json = await r.json();
        if (isMounted && json?.success) setStatus('ok');
      })
      .catch(() => {
        if (isMounted) setStatus('down');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (status === 'pending') return <span>checking…</span>;
  return <span style={{ color: status === 'ok' ? 'green' : 'red' }}>{status}</span>;
}

