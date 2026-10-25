'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import EmojiImg from '@/components/EmojiImg';
import { addLiked, addDisliked } from '@/lib/preferences';
import { ThumbsUp, ThumbsDown, Coffee } from 'lucide-react';
import { DRINKS } from '@/lib/drinks';

const BODY_LABEL = { light: 'ライトボディ', medium: 'ミディアムボディ', full: 'フルボディ' };
const ACIDITY_LABEL = { bright: '酸味：高め', mild: '酸味：中程度', low: '酸味：低め' };
const BODY_COLOR = { light: '#5a8fbf', medium: '#7a6a50', full: '#3b2a1a' };
const ACIDITY_COLOR = { bright: '#c07050', mild: '#a08060', low: '#5a9080' };

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const raw = searchParams.get('result');
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);

  if (!raw) { router.push('/'); return null; }
  const data = JSON.parse(raw);
  const shopParam = searchParams.get('shop');

  const drinkData = DRINKS.find(d => d.name === data.drink);

  const shareText = shopParam
    ? `${shopParam}で今日の一杯☕\n${data.drinkEmoji} ${data.drink}\n${data.snackEmoji} ${data.snack}\n\n#今日の一杯`
    : `今日の私にはこれ！\n${data.drinkEmoji} ${data.drink}\n${data.snackEmoji} ${data.snack}\n\n#今日の一杯`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  function handleLike() {
    addLiked(data.drink);
    setFeedback('liked');
  }

  function handleDislike() {
    addDisliked(data.drink);
    setFeedback('disliked');
  }

  return (
    <main className="h-dvh bg-[#faf6f1] flex flex-col overflow-hidden">

      {/* ── 固定ヘッダー ── */}
      <div className="flex-none px-4 pt-4 pb-2 text-center">
        <p className="text-[10px] tracking-widest text-[#a08060]">TODAY&apos;S RECOMMENDATION</p>
        <h1 className="text-base font-bold tracking-widest text-[#3b2a1a]">今日の一杯</h1>
      </div>

      {/* ── スクロール可能エリア ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        <div className="max-w-sm mx-auto space-y-3">

          {/* メインカード */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#ede8e0] overflow-hidden">
            <div className="bg-[#3b2a1a] px-6 pt-5 pb-4 text-center">
              <EmojiImg emoji={data.drinkEmoji} size={56} className="mx-auto mb-2" />
              <div className="text-white font-bold text-lg leading-snug">{data.drink}</div>

              {/* ボディ・酸味バッジ */}
              {drinkData && (
                <div className="flex justify-center gap-2 mt-2.5">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: BODY_COLOR[drinkData.body] + '55', color: '#fff' }}>
                    {BODY_LABEL[drinkData.body]}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: ACIDITY_COLOR[drinkData.acidity] + '55', color: '#fff' }}>
                    {ACIDITY_LABEL[drinkData.acidity]}
                  </span>
                </div>
              )}
            </div>

            {/* なぜこの一杯か */}
            <div className="px-4 pt-4 pb-3 border-b border-[#f0ebe4]">
              <p className="text-[10px] font-bold tracking-widest text-[#a08060] mb-1.5">WHY THIS</p>
              <p className="text-sm text-[#4a3728] leading-relaxed">{data.drinkReason}</p>
            </div>

            {/* 淹れ方のコツ */}
            {data.brewingTip && (
              <div className="px-4 py-3 flex items-start gap-2.5">
                <Coffee size={14} className="flex-none mt-0.5 text-[#a08060]" strokeWidth={1.8} />
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-[#a08060] mb-0.5">BREWING TIP</p>
                  <p className="text-xs text-[#6b4c2a] leading-relaxed">{data.brewingTip}</p>
                </div>
              </div>
            )}
          </div>

          {/* お茶菓子カード */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#ede8e0]">
            <p className="text-[10px] font-bold tracking-widest text-[#a08060] mb-2">PAIRING · お茶菓子</p>
            <div className="flex items-start gap-3">
              <EmojiImg emoji={data.snackEmoji} size={36} className="flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-[#3b2a1a]">{data.snack}</div>
                <p className="text-sm text-[#7a6050] leading-relaxed mt-1">{data.snackReason}</p>
              </div>
            </div>
          </div>

          {/* フィードバック */}
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#ede8e0] text-center">
            <p className="text-xs text-[#a08060] mb-2.5 tracking-wider">この提案はどうでしたか？</p>
            {feedback === null ? (
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f5f0ea] hover:bg-[#e8f5e9] text-[#5a9e6f] transition-all hover:scale-105"
                >
                  <ThumbsUp size={15} strokeWidth={2} />
                  <span className="text-sm font-medium">良かった</span>
                </button>
                <button
                  onClick={handleDislike}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f5f0ea] hover:bg-[#fdecea] text-[#c0725a] transition-all hover:scale-105"
                >
                  <ThumbsDown size={15} strokeWidth={2} />
                  <span className="text-sm font-medium">合わなかった</span>
                </button>
              </div>
            ) : (
              <p className="text-sm text-[#a08060]">
                {feedback === 'liked' ? '👍 次回に反映します！' : '👎 次回は別のものを提案します'}
              </p>
            )}
          </div>

          {/* ボタン */}
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/')}
              className="flex-1 border border-[#d0c0a8] text-[#6b4c2a] font-bold py-3 rounded-2xl hover:bg-[#f5f0ea] transition-colors text-sm tracking-wide"
            >
              もう一度
            </button>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#3b2a1a] text-white font-bold py-3 rounded-2xl hover:bg-[#5a3e28] transition-colors text-sm tracking-wide text-center"
            >
              𝕏 シェア
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense>
      <ResultContent />
    </Suspense>
  );
}
