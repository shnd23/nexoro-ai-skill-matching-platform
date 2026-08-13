import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#ffffff',
          border: '1.5px solid #e2ddd5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'sans-serif',
            fontSize: 11,
            fontWeight: 900,
            color: '#18181b',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          Nx
        </span>
      </div>
    ),
    { ...size }
  );
}
