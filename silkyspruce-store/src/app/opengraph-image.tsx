import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Silky Spruce | Handcrafted Plant Based Skincare';
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
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111111',
          padding: '48px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(212, 175, 55, 0.45)',
            backgroundColor: '#141414',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: 20,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#D4AF37',
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            HANDCRAFTED IN KENYA
          </div>

          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#ffffff',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            SILKY SPRUCE
          </div>

          <div
            style={{
              width: 96,
              height: 3,
              backgroundColor: '#D4AF37',
              marginBottom: 24,
            }}
          />

          <div
            style={{
              fontSize: 28,
              color: '#d1d5db',
              letterSpacing: '0.04em',
            }}
          >
            Plant Based Skincare, Body Oils &amp; Wellness Rituals
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}