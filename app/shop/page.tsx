'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DRINKS } from '@/lib/drinks';
import { Check, Copy, QrCode, ArrowLeft, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = [
  { key: 'coffee',   label: 'コーヒー', emoji: '☕' },
  { key: 'tea',      label: '紅茶・ハーブ', emoji: '🫖' },
  { key: 'japanese', label: '日本茶', emoji: '🍵' },
  { key: 'chinese',  label: '中国茶', emoji: '🍃' },
] as const;

type CustomSnack = { id: string; name: string; drinks: Set<string> };

let snackIdCounter = 0;
function newSnack(): CustomSnack {
  return { id: String(snackIdCounter++), name: '', drinks: new Set() };
}

function encodeSnacks(snacks: CustomSnack[]): string {
  return snacks
    .filter(s => s.name.trim())
    .map(s => {
      const n = encodeURIComponent(s.name.trim());
      if (s.drinks.size === 0) return n;
      return `${n}:${[...s.drinks].map(encodeURIComponent).join('~')}`;
    })
    .join(',');
}

export default function ShopPage() {
  const router = useRouter();
  const [shopName, setShopName] = useState('');
  const [selectedDrinks, setSelectedDrinks] = useState<Set<string>>(new Set());
  const [featuredDrinks, setFeaturedDrinks] = useState<Set<string>>(new Set());
  const [customSnacks, setCustomSnacks] = useState<CustomSnack[]>([newSnack()]);
  const [expandedSnack, setExpandedSnack] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function toggleDrink(name: string) {
    setSelectedDrinks(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
        setFeaturedDrinks(f => { const fn = new Set(f); fn.delete(name); return fn; });
        setCustomSnacks(cs => cs.map(s => {
          if (!s.drinks.has(name)) return s;
          const nd = new Set(s.drinks); nd.delete(name);
          return { ...s, drinks: nd };
        }));
      } else {
        next.add(name);
      }
      return next;
    });
  }

  function toggleFeatured(e: React.MouseEvent, name: string) {
    e.stopPropagation();
    if (!selectedDrinks.has(name)) return;
    setFeaturedDrinks(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function toggleCategory(cat: string) {
    const catDrinks = DRINKS.filter(d => d.category === cat).map(d => d.name);
    const allSelected = catDrinks.every(n => selectedDrinks.has(n));
    setSelectedDrinks(prev => {
      const next = new Set(prev);
      allSelected ? catDrinks.forEach(n => next.delete(n)) : catDrinks.forEach(n => next.add(n));
      return next;
    });
  }

  function addSnack() {
    setCustomSnacks(prev => [...prev, newSnack()]);
  }

  function updateSnackName(id: string, name: string) {
    setCustomSnacks(prev => prev.map(s => s.id === id ? { ...s, name } : s));
  }

  function toggleSnackDrink(id: string, drink: string) {
    setCustomSnacks(prev => prev.map(s => {
      if (s.id !== id) return s;
      const next = new Set(s.drinks);
      next.has(drink) ? next.delete(drink) : next.add(drink);
      return { ...s, drinks: next };
    }));
  }

  function removeSnack(id: string) {
    setCustomSnacks(prev => {
      const next = prev.filter(s => s.id !== id);
      return next.length === 0 ? [newSnack()] : next;
    });
  }

  function buildShopUrl() {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://y-liard-gamma.vercel.app';
    if (selectedDrinks.size === 0) return base;
    const menu = [...selectedDrinks].map(encodeURIComponent).join(',');
    const shop = shopName.trim() ? `&shop=${encodeURIComponent(shopName.trim())}` : '';
    const featured = featuredDrinks.size > 0 ? `&featured=${[...featuredDrinks].map(encodeURIComponent).join(',')}` : '';
    const snacksStr = encodeSnacks(customSnacks);
    const snacks = snacksStr ? `&snacks=${snacksStr}` : '';
    return `${base}/?menu=${menu}${shop}${featured}${snacks}`;
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildShopUrl()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleQr() {
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(buildShopUrl())}`, '_blank');
  }

  const drinkCount = selectedDrinks.size;
  const featuredCount = featuredDrinks.size;
  const validSnackCount = customSnacks.filter(s => s.name.trim()).length;

  return (
    <main className="h-dvh bg-[#faf6f1] flex flex-col overflow-hidden">

      {/* ヘッダー */}
      <div className="flex-none px-4 pt-4 pb-3 border-b border-[#ede8e0] bg-[#faf6f1]">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold tracking-widest text-[#3b2a1a]">お店設定</h1>
            <p className="text-xs text-[#a08060] mt-0.5">SHOP SETUP</p>
          </div>
          <button onClick={() => router.back()} className="flex items-center gap-1 text-[#a08060] hover:text-[#6b4c2a]">
            <ArrowLeft size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* スクロールエリア */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-sm mx-auto px-4 py-4 space-y-6">

          {/* 店名 */}
          <div>
            <p className="text-xs font-bold tracking-widest text-[#a08060] mb-2">SHOP NAME · 店名</p>
            <input
              type="text"
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              placeholder="例：珈琲屋 一服"
              className="w-full text-sm text-[#4a3728] placeholder-[#c0a88a] bg-white border border-[#ede8e0] rounded-xl px-3 py-2.5 outline-none focus:border-[#a08060] transition-colors"
            />
          </div>

          {/* ドリンクメニュー */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold tracking-widest text-[#a08060]">MENU · 飲み物</p>
              <p className="text-xs text-[#c0a88a]">
                {drinkCount > 0 ? `${drinkCount}種` : '未選択'}
                {featuredCount > 0 && <span className="ml-1 text-[#d4a030]">⭐{featuredCount}</span>}
              </p>
            </div>
            <p className="text-xs text-[#a08060] mb-3">⭐ タップで「今日のおすすめ」に設定（同等の場合に優先）</p>
            <div className="space-y-5">
              {CATEGORIES.map(cat => {
                const drinks = DRINKS.filter(d => d.category === cat.key);
                const allCatSelected = drinks.every(d => selectedDrinks.has(d.name));
                const someCatSelected = drinks.some(d => selectedDrinks.has(d.name));
                return (
                  <div key={cat.key}>
                    <button onClick={() => toggleCategory(cat.key)} className="w-full flex items-center justify-between mb-2">
                      <span className="text-xs font-bold tracking-widest text-[#a08060]">{cat.emoji} {cat.label}</span>
                      <span className={`text-xs ${allCatSelected ? 'text-[#3b2a1a] font-bold' : someCatSelected ? 'text-[#a08060]' : 'text-[#d0c0a8]'}`}>
                        {drinks.filter(d => selectedDrinks.has(d.name)).length}/{drinks.length}
                      </span>
                    </button>
                    <div className="space-y-1.5">
                      {drinks.map(drink => {
                        const isSelected = selectedDrinks.has(drink.name);
                        const isFeatured = featuredDrinks.has(drink.name);
                        return (
                          <button
                            key={drink.name}
                            onClick={() => toggleDrink(drink.name)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                              isSelected ? 'bg-[#3b2a1a] text-white' : 'bg-white border border-[#ede8e0] text-[#4a3728]'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full flex-none flex items-center justify-center border ${isSelected ? 'bg-white border-transparent' : 'border-[#d0c0a8]'}`}>
                              {isSelected && <Check size={12} className="text-[#3b2a1a]" strokeWidth={3} />}
                            </div>
                            <span className="text-sm font-medium text-left flex-1">{drink.name}</span>
                            <span className="text-base flex-none">{drink.emoji}</span>
                            {isSelected && (
                              <span onClick={e => toggleFeatured(e, drink.name)}
                                className={`flex-none text-base transition-all ${isFeatured ? 'opacity-100' : 'opacity-25 hover:opacity-60'}`}>
                                ⭐
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* お菓子メニュー（自由入力） */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold tracking-widest text-[#a08060]">SNACKS · お菓子</p>
              {validSnackCount > 0 && <p className="text-xs text-[#c0a88a]">{validSnackCount}種登録</p>}
            </div>
            <p className="text-xs text-[#a08060] mb-3 leading-relaxed">
              お店のメニュー名を入力してください。「合う飲み物」を指定するとより正確になります。空欄ならAIが判断します。
            </p>
            <div className="space-y-2">
              {customSnacks.map(snack => (
                <div key={snack.id} className="bg-white border border-[#ede8e0] rounded-xl overflow-hidden">
                  {/* 名前入力行 */}
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <input
                      type="text"
                      value={snack.name}
                      onChange={e => updateSnackName(snack.id, e.target.value)}
                      placeholder="例：本日のスコーン"
                      className="flex-1 text-sm text-[#4a3728] placeholder-[#c0a88a] bg-transparent outline-none"
                    />
                    {selectedDrinks.size > 0 && (
                      <button
                        onClick={() => setExpandedSnack(expandedSnack === snack.id ? null : snack.id)}
                        className="flex items-center gap-1 text-xs text-[#a08060] flex-none"
                      >
                        <span>合う飲み物</span>
                        {expandedSnack === snack.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    )}
                    <button onClick={() => removeSnack(snack.id)} className="flex-none text-[#c0a88a] hover:text-[#c07050]">
                      <X size={14} />
                    </button>
                  </div>

                  {/* 合う飲み物チップ（展開時） */}
                  {expandedSnack === snack.id && selectedDrinks.size > 0 && (
                    <div className="px-3 pb-3 border-t border-[#f0ebe4]">
                      <p className="text-[10px] text-[#c0a88a] mt-2 mb-1.5">空欄 = AIが判断 / 選ぶと優先的に組み合わせます</p>
                      <div className="flex flex-wrap gap-1.5">
                        {[...selectedDrinks].map(d => {
                          const isLinked = snack.drinks.has(d);
                          return (
                            <button
                              key={d}
                              onClick={() => toggleSnackDrink(snack.id, d)}
                              className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                                isLinked ? 'bg-[#3b2a1a] text-white' : 'bg-[#f0ebe4] text-[#6b4c2a]'
                              }`}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                      {snack.drinks.size > 0 && (
                        <p className="text-[10px] text-[#a08060] mt-1.5">{snack.drinks.size}種の飲み物に優先して組み合わせます</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={addSnack}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[#d0c0a8] text-[#a08060] hover:bg-[#f5f0ea] transition-colors text-sm"
              >
                <Plus size={14} /> お菓子を追加
              </button>
            </div>
          </div>

          {/* QRコード生成 */}
          <div className="bg-white border border-[#ede8e0] rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <QrCode size={14} className="text-[#a08060]" strokeWidth={1.8} />
              <p className="text-xs font-bold tracking-widest text-[#a08060]">QRコード生成</p>
            </div>
            {drinkCount === 0 ? (
              <p className="text-xs text-[#c0a88a]">飲み物を選択するとURLが生成されます</p>
            ) : (
              <>
                <p className="text-xs text-[#7a6050] leading-relaxed">
                  {drinkCount}種の飲み物
                  {validSnackCount > 0 ? `・${validSnackCount}種のお菓子` : ''}
                  {featuredCount > 0 ? `・⭐${featuredCount}件のおすすめ` : ''}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      copied ? 'bg-[#5a9e6f] text-white' : 'bg-[#f5f0ea] text-[#3b2a1a] hover:bg-[#ede4d8]'
                    }`}
                  >
                    <Copy size={13} strokeWidth={2} />
                    {copied ? '✓ コピー済み' : 'URLをコピー'}
                  </button>
                  <button
                    onClick={handleQr}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold bg-[#3b2a1a] text-white hover:bg-[#5a3e28] transition-all"
                  >
                    <QrCode size={13} strokeWidth={2} />
                    QRコードを表示
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="h-2" />
        </div>
      </div>
    </main>
  );
}
