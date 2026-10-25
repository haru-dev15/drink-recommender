'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DRINKS } from '@/lib/drinks';
import { getPreferences, setOwnedDrinks } from '@/lib/preferences';
import { Check, Store } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { key: 'coffee',   label: 'コーヒー', emoji: '☕' },
  { key: 'tea',      label: '紅茶・ハーブ', emoji: '🫖' },
  { key: 'japanese', label: '日本茶', emoji: '🍵' },
  { key: 'chinese',  label: '中国茶', emoji: '🍃' },
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const prefs = getPreferences();
    setSelected(new Set(prefs.ownedDrinks));
  }, []);

  function toggle(name: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
    setSaved(false);
  }

  function toggleCategory(cat: string) {
    const catDrinks = DRINKS.filter(d => d.category === cat).map(d => d.name);
    const allSelected = catDrinks.every(n => selected.has(n));
    setSelected(prev => {
      const next = new Set(prev);
      allSelected ? catDrinks.forEach(n => next.delete(n)) : catDrinks.forEach(n => next.add(n));
      return next;
    });
    setSaved(false);
  }

  function selectAll() { setSelected(new Set(DRINKS.map(d => d.name))); setSaved(false); }
  function clearAll() { setSelected(new Set()); setSaved(false); }

  function handleSave() {
    setOwnedDrinks([...selected]);
    setSaved(true);
    setTimeout(() => router.push('/'), 800);
  }

  const count = selected.size;
  const total = DRINKS.length;
  const isFiltered = count > 0 && count < total;

  return (
    <main className="h-dvh bg-[#faf6f1] flex flex-col overflow-hidden">

      {/* ヘッダー */}
      <div className="flex-none px-4 pt-4 pb-3 border-b border-[#ede8e0] bg-[#faf6f1]">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold tracking-widest text-[#3b2a1a]">手持ちの飲み物</h1>
            <p className="text-xs text-[#a08060] mt-0.5">
              {count === 0 ? `未選択 — 全${total}種類からおすすめ` : isFiltered ? `${count}種類を選択中` : `全${total}種類を選択中`}
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <button onClick={selectAll} className="text-[#a08060] hover:text-[#6b4c2a]">全選択</button>
            <span className="text-[#d0c0a8]">|</span>
            <button onClick={clearAll} className="text-[#a08060] hover:text-[#6b4c2a]">解除</button>
          </div>
        </div>
      </div>

      {/* リスト */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-sm mx-auto px-4 py-3 space-y-5">
          {CATEGORIES.map(cat => {
            const drinks = DRINKS.filter(d => d.category === cat.key);
            const allCatSelected = drinks.every(d => selected.has(d.name));
            const someCatSelected = drinks.some(d => selected.has(d.name));
            return (
              <div key={cat.key}>
                <button
                  onClick={() => toggleCategory(cat.key)}
                  className="w-full flex items-center justify-between mb-2"
                >
                  <span className="text-xs font-bold tracking-widest text-[#a08060]">{cat.emoji} {cat.label}</span>
                  <span className={`text-xs ${allCatSelected ? 'text-[#3b2a1a] font-bold' : someCatSelected ? 'text-[#a08060]' : 'text-[#d0c0a8]'}`}>
                    {drinks.filter(d => selected.has(d.name)).length}/{drinks.length}
                  </span>
                </button>
                <div className="space-y-1.5">
                  {drinks.map(drink => {
                    const isSelected = selected.has(drink.name);
                    return (
                      <button
                        key={drink.name}
                        onClick={() => toggle(drink.name)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          isSelected ? 'bg-[#3b2a1a] text-white' : 'bg-white border border-[#ede8e0] text-[#4a3728]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex-none flex items-center justify-center border ${
                          isSelected ? 'bg-white border-transparent' : 'border-[#d0c0a8]'
                        }`}>
                          {isSelected && <Check size={12} className="text-[#3b2a1a]" strokeWidth={3} />}
                        </div>
                        <span className="text-sm font-medium text-left flex-1">{drink.name}</span>
                        <span className="text-lg flex-none">{drink.emoji}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* お店向けリンク */}
          <Link
            href="/shop"
            className="flex items-center gap-3 w-full px-4 py-3 bg-white border border-[#ede8e0] rounded-2xl text-[#4a3728] hover:bg-[#f5f0ea] transition-colors"
          >
            <div className="w-8 h-8 bg-[#f5f0ea] rounded-full flex items-center justify-center flex-none">
              <Store size={16} className="text-[#a08060]" strokeWidth={1.8} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-[#3b2a1a]">喫茶店・カフェの方はこちら</p>
              <p className="text-xs text-[#a08060]">メニュー設定・QRコード生成</p>
            </div>
            <span className="text-[#c0a88a] text-xs">→</span>
          </Link>

          <div className="h-2" />
        </div>
      </div>

      {/* 保存ボタン */}
      <div className="flex-none px-4 py-3 border-t border-[#ede8e0] bg-[#faf6f1]">
        <div className="max-w-sm mx-auto flex gap-2">
          <button
            onClick={() => router.push('/')}
            className="flex-none border border-[#d0c0a8] text-[#6b4c2a] font-bold py-3 px-4 rounded-2xl hover:bg-[#f5f0ea] transition-colors text-sm"
          >
            ← 戻る
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 font-bold py-3 rounded-2xl transition-all text-sm tracking-wider ${
              saved ? 'bg-[#5a9e6f] text-white' : 'bg-[#3b2a1a] hover:bg-[#5a3e28] text-white'
            }`}
          >
            {saved ? '✓ 保存しました' : `${count === 0 ? '全種類で' : `${count}種類で`}おすすめする`}
          </button>
        </div>
      </div>
    </main>
  );
}
