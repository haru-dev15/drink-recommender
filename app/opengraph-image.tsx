import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '今日の一杯';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#faf6f1',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 背景の装飾円 */}
        <div style={{
          position: 'absolute', width: 500, height: 500,
          borderRadius: '50%', background: '#3b2a1a', opacity: 0.04,
          top: -100, right: -100, display: 'flex',
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300,
          borderRadius: '50%', background: '#3b2a1a', opacity: 0.04,
          bottom: -50, left: -50, display: 'flex',
        }} />

        {/* コーヒーカップアイコン */}
        <div style={{
          width: 120, height: 120,
          borderRadius: '50%',
          background: '#3b2a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          fontSize: 56,
        }}>
          ☕
        </div>

        {/* タイトル */}
        <div style={{
          fontSize: 72,
          fontWeight: 700,
          color: '#3b2a1a',
          letterSpacing: '0.12em',
          marginBottom: 16,
        }}>
          今日の一杯
        </div>

        {/* サブタイトル */}
        <div style={{
          fontSize: 28,
          color: '#a08060',
          letterSpacing: '0.1em',
          marginBottom: 48,
        }}>
          YOUR PERFECT CUP TODAY
        </div>

        {/* 説明文 */}
        <div style={{
          fontSize: 24,
          color: '#6b4c2a',
          background: '#fff',
          borderRadius: 16,
          padding: '16px 40px',
          border: '1px solid #ede8e0',
        }}>
          気分・体調を選ぶだけで、AIが今日のお茶を提案
        </div>
      </div>
    ),
    { ...size },
  );
}
