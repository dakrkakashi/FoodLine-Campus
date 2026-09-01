import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'FoodLine Campus — Express Pre-Ordering & Pickup Ecosystem';
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
          background: 'linear-gradient(135deg, #07070B 0%, #12121A 50%, #1C120C 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: '#F5F5F7',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Glow Accent Circles */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: 'rgba(255, 107, 44, 0.25)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '10%',
            width: '400px',
            height: '400px',
            background: 'rgba(0, 212, 170, 0.2)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 107, 44, 0.15)',
            border: '1px solid rgba(255, 107, 44, 0.4)',
            borderRadius: '9999px',
            padding: '10px 24px',
            marginBottom: '28px',
          }}
        >
          <span style={{ color: '#FF6B2C', fontSize: '20px', fontWeight: 700, letterSpacing: '2px' }}>
            ⚡ SANJIVANI UNIVERSITY • CAFE @7
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '68px',
            fontWeight: 900,
            letterSpacing: '-2px',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '20px',
            display: 'flex',
          }}
        >
          <span>FoodLine</span>
          <span style={{ color: '#FF6B2C', marginLeft: '12px' }}>Campus</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#A1A1AA',
            textAlign: 'center',
            maxWidth: '850px',
            lineHeight: 1.4,
            marginBottom: '40px',
          }}
        >
          Skip 20-minute canteen queues. Pre-order meals for lecture breaks with guaranteed 60-second express pickup.
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '18px',
              fontWeight: 600,
              color: '#00D4AA',
            }}
          >
            🛡️ 60-Cap Slot Throttling
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '18px',
              fontWeight: 600,
              color: '#FFB347',
            }}
          >
            🔐 4-Digit Anti-Theft OTP
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '18px',
              fontWeight: 600,
              color: '#3B82F6',
            }}
          >
            ⚡ Live Kitchen SSE Stream
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
