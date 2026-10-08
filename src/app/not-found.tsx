import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem' }}>
      <h2>Page Not Found</h2>
      <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', color: '#666' }}>Could not find requested resource</p>
      <Link href="/" style={{ padding: '8px 16px', background: '#0A7E5E', color: '#fff', borderRadius: '8px', textDecoration: 'none' }}>
        Return to Dashboard
      </Link>
    </div>
  );
}
