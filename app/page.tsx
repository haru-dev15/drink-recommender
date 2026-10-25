'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPreferences } from '@/lib/preferences';
import {
  Moon, BatteryLow, Smile, Zap, Wind, AlertCircle,
  TrendingUp, Heart, Sparkles, Brain, Gift, Cloud,
  Thermometer, ArrowDownCircle, Trophy, Activity,
  MicOff, Flower2, Beer, Target, BedDouble,
  Droplets, Dumbbell, Star, Utensils, Sunrise, Bath,
  Coffee, ChevronRight, Settings,
  Feather, Shield, Leaf, Flame, Apple, CheckCircle,
  Minus, Scale,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CategoryFilter } from '@/lib/prompt';

type Item = { icon: LucideIcon; label: string; value: string; color: string };

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string; emoji: string }[] = [
  { value: 'all',      label: 'すべて',  emoji: '✨' },
  { value: 'coffee',   label: 'コーヒー', emoji: '☕' },
  { value: 'tea',      label: '紅茶',    emoji: '🫖' },
  { value: 'japanese', label: '日本茶',  emoji: '🍵' },
  { value: 'chinese',  label: '中国茶',  emoji: '🍃' },
];

const MOODS: Item[] = [
  { icon: Moon,        label: '眠い',       value: '眠い',               color: '#7c6fa0' },
  { icon: BatteryLow,  label: '疲れた',     value: '疲れた',             color: '#c0725a' },
  { icon: Smile,       label: '元気',       value: '元気',               color: '#5a9e6f' },
  { icon: Zap,         label: 'イライラ',   value: 'イライラ',           color: '#d4a030' },
  { icon: Wind,        label: 'ゆったり',   value: 'ゆったり',           color: '#5a8fbf' },
  { icon: AlertCircle, label: '不安',       value: '不安',               color: '#9e7060' },
  { icon: TrendingUp,  label: 'やる気',     value: 'やる気に満ちている', color: '#e06b3a' },
  { icon: Heart,       label: '幸せ',       value: '幸せな気持ち',       color: '#d46080' },
  { icon: Sparkles,    label: 'わくわく',   value: 'わくわくしている',   color: '#b07ad0' },
  { icon: Brain,       label: '瞑想したい', value: '瞑想・内省したい',   color: '#5aa0a0' },
  { icon: Gift,        label: 'ご褒美',     value: '自分へのご褒美気分', color: '#c0804a' },
  { icon: Cloud,       label: 'ぼんやり',   value: 'ぼんやりしたい',     color: '#8090a8' },
];

type ConditionGroup = { label: string; items: Item[] };

const CONDITION_GROUPS: ConditionGroup[] = [
  {
    label: '今日の調子',
    items: [
      { icon: Minus,       label: 'ふつう',     value: 'ふつう・特に問題はない',       color: '#9090a0' },
      { icon: Scale,       label: 'まあまあ',   value: 'まあまあ・可もなく不可もなく', color: '#8090a0' },
      { icon: Feather,     label: '体が軽い',   value: '体が軽い・絶好調に近い',       color: '#5a8fbf' },
      { icon: CheckCircle, label: 'よく眠れた', value: 'よく眠れた・睡眠が充実',       color: '#5a9e6f' },
      { icon: Apple,       label: '食欲がある', value: '食欲がある・胃腸の調子が良い', color: '#c05a5a' },
      { icon: Trophy,      label: '絶好調',     value: '絶好調',                       color: '#c0a030' },
    ],
  },
  {
    label: '不調・症状',
    items: [
      { icon: AlertCircle,     label: '胃が重い',     value: '胃が重い',               color: '#c07050' },
      { icon: Activity,        label: '頭が痛い',     value: '頭痛がある',             color: '#a06080' },
      { icon: MicOff,          label: '喉が痛い',     value: '喉が痛い',               color: '#c07060' },
      { icon: Thermometer,     label: '熱っぽい',     value: '発熱・熱っぽい',         color: '#c05050' },
      { icon: Zap,             label: '肩こり',       value: '肩こり・首のこり',       color: '#7090a0' },
      { icon: ArrowDownCircle, label: 'だるい',       value: 'だるい',                 color: '#9090a0' },
      { icon: Flower2,         label: '花粉症',       value: '花粉症・目がかゆい',     color: '#90b060' },
      { icon: Beer,            label: '二日酔い',     value: '二日酔い',               color: '#b09040' },
      { icon: Droplets,        label: 'むくみ',       value: 'むくみが気になる',       color: '#4090b0' },
      { icon: BedDouble,       label: '眠れない',     value: '眠れない・睡眠が浅い',   color: '#7060a0' },
      { icon: Thermometer,     label: '冷え性',       value: '冷え性',                 color: '#5a8fbf' },
    ],
  },
  {
    label: '目的・シーン',
    items: [
      { icon: Target,   label: '集中したい',   value: '集中したい',                     color: '#4080c0' },
      { icon: Sunrise,  label: '朝活',         value: '朝・1日のスタート',              color: '#d09040' },
      { icon: Utensils, label: '食後',         value: '食後・消化を助けたい',           color: '#a07050' },
      { icon: Bath,     label: '夜リラックス', value: '夜・就寝前のリラックス',         color: '#6070a0' },
      { icon: Dumbbell, label: '運動後',       value: '運動後・筋肉疲労',               color: '#508050' },
      { icon: Star,     label: '肌ケア',       value: '肌荒れ・美容が気になる',         color: '#c08090' },
      { icon: Shield,   label: '免疫ケア',     value: '免疫を高めたい・体を守りたい',   color: '#5a9090' },
      { icon: Leaf,     label: 'デトックス',   value: 'デトックスしたい・体をリセット', color: '#6a9e50' },
      { icon: Flame,    label: '体を温めたい', value: '体を温めたい・冷えが気になる',   color: '#d4703a' },
    ],
  },
];

function IconButton({ item, selected, onClick }: { item: Item; selected: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 py-3 rounded-2xl transition-all duration-200 ${
        selected ? 'bg-[#3b2a1a] shadow-lg scale-105' : 'bg-[#f5f0ea] hover:bg-[#ede4d8]'
      }`}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: selected ? 'rgba(255,255,255,0.15)' : item.color + '22' }}
      >
        <Icon size={18} style={{ color: selected ? '#fff' : item.color }} strokeWidth={1.8} />
      </div>
      <span className="text-xs font-medium leading-tight text-center px-1" style={{ color: selected ? '#fff' : '#6b4c2a' }}>
        {item.label}
      </span>
    </button>
  );
}

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<'mood' | 'condition'>('mood');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [ownedCount, setOwnedCount] = useState(0);
  const [shopMenuDrinks, setShopMenuDrinks] = useState<string[] | null>(null);
  const [shopName, setShopName] = useState<string | null>(null);
  const [shopSnacks, setShopSnacks] = useState<{ name: string; drinks: string[] }[] | null>(null);
  const [shopFeatured, setShopFeatured] = useState<string[] | null>(null);

  useEffect(() => {
    const prefs = getPreferences();
    setOwnedCount(prefs.ownedDrinks.length);

    const params = new URLSearchParams(window.location.search);
    const menu = params.get('menu');
    const shop = params.get('shop');
    const featured = params.get('featured');
    const snacks = params.get('snacks');
    if (menu) setShopMenuDrinks(menu.split(',').map(decodeURIComponent));
    if (shop) setShopName(decodeURIComponent(shop));
    if (featured) setShopFeatured(featured.split(',').map(decodeURIComponent));
    if (snacks) {
      setShopSnacks(snacks.split(',').map(raw => {
        const colonIdx = raw.indexOf(':');
        if (colonIdx === -1) return { name: decodeURIComponent(raw), drinks: [] };
        const name = decodeURIComponent(raw.slice(0, colonIdx));
        const drinks = raw.slice(colonIdx + 1).split('~').map(decodeURIComponent);
        return { name, drinks };
      }));
    }
  }, []);

  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [freeText, setFreeText] = useState('');
  const [loading, setLoading] = useState(false);

  function toggle(value: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  }

  function goToCondition() {
    setStep('condition');
  }

  function goBack() {
    setStep('mood');
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const preferences = getPreferences();
      if (shopMenuDrinks) preferences.ownedDrinks = shopMenuDrinks;
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moods: selectedMoods,
          conditions: selectedConditions,
          freeText: freeText.trim(),
          preferences,
          categoryFilter,
          shopSnacks: shopSnacks ?? undefined,
          featuredDrinks: shopFeatured ?? undefined,
        }),
      });
      const data = await res.json();
      if (data.error) { alert('エラー: ' + data.error); setLoading(false); return; }
      const resultParams: Record<string, string> = { result: JSON.stringify(data) };
      if (shopName) resultParams.shop = shopName;
      router.push(`/result?${new URLSearchParams(resultParams)}`);
    } catch {
      alert('通信エラーが発生しました。');
      setLoading(false);
    }
  }

  return (
    <main className="h-dvh bg-[#faf6f1] flex flex-col overflow-hidden">

      {/* ── 固定ヘッダー ── */}
      <div className="flex-none px-4 pt-4 pb-2 flex flex-col items-center">
        {/* ロゴ */}
        <div className="flex items-center justify-between w-full max-w-sm mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#3b2a1a] rounded-full flex items-center justify-center">
              <Coffee size={16} color="#fff" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-widest text-[#3b2a1a] leading-none">今日の一杯</h1>
              {shopMenuDrinks ? (
                <p className="text-[10px] text-[#5a9e6f] font-bold tracking-wider leading-none mt-0.5">
                  🏪 {shopName ?? 'このお店'}のメニューから提案
                </p>
              ) : (
                <p className="text-[10px] text-[#a08060] tracking-wider leading-none mt-0.5">YOUR PERFECT CUP TODAY</p>
              )}
            </div>
          </div>
          {!shopMenuDrinks && (
            <Link href="/settings" className="flex items-center gap-1 text-[#a08060] hover:text-[#6b4c2a] transition-colors">
              {ownedCount > 0 && (
                <span className="text-[10px] font-bold text-[#3b2a1a] bg-[#ede8e0] px-1.5 py-0.5 rounded-full">
                  {ownedCount}種
                </span>
              )}
              <Settings size={16} strokeWidth={1.8} />
            </Link>
          )}
        </div>

        {/* カテゴリフィルター */}
        <div className="flex gap-1.5 w-full max-w-sm mb-2.5">
          {CATEGORY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setCategoryFilter(opt.value)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === opt.value
                  ? 'bg-[#3b2a1a] text-white shadow-sm'
                  : 'bg-[#f0ebe4] text-[#6b4c2a] hover:bg-[#ede4d8]'
              }`}
            >
              <span>{opt.emoji}</span>
              <span className="tracking-wide">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* ステップインジケーター */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === 'mood' ? 'bg-[#3b2a1a]' : 'bg-[#d0c0a8]'}`} />
          <div className="w-6 h-px bg-[#d0c0a8]" />
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === 'condition' ? 'bg-[#3b2a1a]' : 'bg-[#d0c0a8]'}`} />
        </div>
      </div>

      {/* ── スクロール可能なカードエリア ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        <div className="max-w-sm mx-auto">
          {step === 'mood' ? (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#ede8e0]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold tracking-widest text-[#a08060]">MOOD · 気分</h2>
                <span className="text-xs text-[#c0a88a]">1 / 2</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {MOODS.map(m => (
                  <IconButton key={m.value} item={m} selected={selectedMoods.includes(m.value)}
                    onClick={() => toggle(m.value, selectedMoods, setSelectedMoods)} />
                ))}
              </div>
              <p className="text-xs text-center text-[#c0a88a] mt-2">複数選択OK · 選ばなくてもOK</p>
              <div className="mt-3">
                <p className="text-xs font-bold tracking-widest text-[#a08060] mb-1.5">FREE · 自由記入（任意）</p>
                <textarea
                  value={freeText}
                  onChange={e => setFreeText(e.target.value)}
                  placeholder="例：仕事が忙しくて気が張っている、明日大事な発表がある…"
                  rows={2}
                  className="w-full text-sm text-[#4a3728] placeholder-[#c0a88a] bg-[#faf6f1] border border-[#ede8e0] rounded-xl px-3 py-2 resize-none outline-none focus:border-[#a08060] transition-colors"
                />
              </div>
              <button
                onClick={goToCondition}
                className="mt-3 w-full bg-[#3b2a1a] hover:bg-[#5a3e28] text-white font-bold py-3 rounded-2xl transition-all text-sm tracking-wider flex items-center justify-center gap-2"
              >
                次へ <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#ede8e0]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold tracking-widest text-[#a08060]">CONDITION · 体調</h2>
                <span className="text-xs text-[#c0a88a]">2 / 2</span>
              </div>
              <div className="space-y-3">
                {CONDITION_GROUPS.map(group => (
                  <div key={group.label}>
                    <p className="text-[10px] font-bold tracking-widest text-[#c0a88a] mb-1.5">{group.label}</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {group.items.map(c => (
                        <IconButton key={c.value} item={c} selected={selectedConditions.includes(c.value)}
                          onClick={() => toggle(c.value, selectedConditions, setSelectedConditions)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-[#c0a88a] mt-2">複数選択OK · 選ばなくてもOK</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={goBack}
                  className="flex-none border border-[#d0c0a8] text-[#6b4c2a] font-bold py-3 px-4 rounded-2xl hover:bg-[#f5f0ea] transition-colors text-sm"
                >
                  ←
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-[#3b2a1a] hover:bg-[#5a3e28] disabled:bg-[#c0a88a] text-white font-bold py-3 rounded-2xl transition-all text-sm tracking-wider"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      選んでいます...
                    </span>
                  ) : '今日の一杯を見る'}
                </button>
              </div>
            </div>
          )}
        </div>
        <p className="text-center mt-3">
          <Link href="/privacy" className="text-[10px] text-[#c0a88a] hover:text-[#a08060] transition-colors">
            プライバシーポリシー
          </Link>
        </p>
      </div>
    </main>
  );
}
