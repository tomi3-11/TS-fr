import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Tech MSpace - Developer Community';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#020617', // slate-950
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Abstract Background Grid (Simulated with CSS) */}
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'radial-gradient(circle at 2px 2px, #1e293b 1px, transparent 0)',
            backgroundSize: '40px 40px',
            opacity: 0.3
        }} />

        {/* Glowing Orb */}
        <div style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            background: '#3b82f6',
            filter: 'blur(200px)',
            opacity: 0.15,
            borderRadius: '50%'
        }} />

        {/* Logo Container */}
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(30, 41, 59, 0.5)', // slate-800/50
                border: '1px solid #334155', // slate-700
                borderRadius: '24px',
                padding: '24px',
                marginBottom: '32px',
                boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)'
            }}
        >
             <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#60a5fa" // blue-400
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 64, fontWeight: 900, color: 'white', letterSpacing: '-0.05em', display: 'flex' }}>
                Tech <span style={{ color: '#3b82f6', marginLeft: '12px' }}>MSpace</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 500, color: '#94a3b8', marginTop: '16px' }}>
                Connect. Collaborate. Innovate.
            </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}