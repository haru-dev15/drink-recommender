@AGENTS.md

# tea-app — 今日の一杯

気分・体調を選ぶと、最適な飲み物とお菓子をAIが提案するWebアプリ。

## 本番URL

https://y-liard-gamma.vercel.app

## 技術スタック

| 役割 | 技術 |
|---|---|
| フレームワーク | Next.js 16（App Router）, TypeScript, Tailwind CSS |
| AI | Claude API — `claude-haiku-4-5-20251001`（コスト重視）|
| アイコン | Lucide React（ミニマルなアイコンをカラー付きで使用）|
| 絵文字 | Twemoji CDN（`components/EmojiImg.tsx`） |
| 好み学習 | localStorage（サーバー保存なし） |
| ホスティング | Vercel（`vercel --prod` でデプロイ） |

## ファイル構成

```
app/
  page.tsx              メイン選択UI（気分→体調の2ステップ）
  result/page.tsx       結果表示（飲み物・お菓子・フィードバック）
  api/recommend/
    route.ts            Claude API呼び出しエンドポイント
components/
  EmojiImg.tsx          Twemoji CDN で絵文字を画像表示
lib/
  drinks.ts             飲み物データベース（47種類）
  prompt.ts             Claude へのプロンプト生成
  preferences.ts        localStorage で好み管理
```

## 飲み物データベース（lib/drinks.ts）

現在47種類：
- コーヒー: 26種類（スペシャルティ豆・定番メニュー）
- 紅茶・ハーブティー: 20種類（成分根拠あり）
- 日本茶: 10種類

`Drink` 型：
```typescript
type Drink = {
  name: string;
  category: 'coffee' | 'tea' | 'japanese';
  emoji: string;
  caffeine: 'none' | 'low' | 'medium' | 'high';
  properties: string[];    // 体・心への働き
  goodFor: string[];       // 合う気分・体調キーワード
  notGoodFor: string[];    // 避けたほうがいい気分・体調キーワード
  pairings: { name: string; emoji: string }[];  // 飲み物に合うお菓子4種
};
```

## 入力フロー（app/page.tsx）

1. **カテゴリフィルター**（すべて / ☕コーヒー / 🫖紅茶 / 🍵日本茶）
2. **Step 1 — 気分選択**（12種、Lucideアイコン、3列グリッド）
3. **Step 2 — 体調選択**（18種、Lucideアイコン、3列グリッド）
4. 両ステップとも「自由記入（任意）」テキストエリアあり

状態変数：
```typescript
const [step, setStep] = useState<'mood' | 'condition'>('mood');
const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
const [freeText, setFreeText] = useState('');
```

API呼び出し時に `{ moods, conditions, freeText, preferences, categoryFilter }` を送信。

## プロンプト設計（lib/prompt.ts）

- `categoryFilter` で DRINKS をフィルタリングしてリストを絞る
- 各飲み物の `pairings` もリストに含め、AIがお菓子をその中から選ぶ
- `freeText` がある場合は最優先で考慮し、結果コメントに反映するよう指示
- 好み履歴（liked/disliked）を注入。disliked は絶対に選ばない

JSON出力フォーマット：
```json
{
  "drink": "飲み物名",
  "drinkEmoji": "絵文字",
  "drinkReason": "理由（2〜3文）",
  "snack": "お菓子名（pairingsリスト内から）",
  "snackEmoji": "絵文字",
  "snackReason": "理由（1〜2文）"
}
```

## 好み学習（lib/preferences.ts）

- localStorage キー: `tea-app-preferences`
- 👍「良かった」→ `addLiked()` / 👎「合わなかった」→ `addDisliked()`
- 各最大20件保存。liked追加時はdislikedから除去（逆も同様）
- ブラウザごとに独立。複数人が同じURLを使っても混ざらない

## 結果画面（app/result/page.tsx）

- 飲み物: `EmojiImg`（Twemoji）+ 名前 + 理由
- お菓子: `EmojiImg` + 名前 + ペアリング理由
- フィードバック: 👍👎ボタン → localStorage に保存
- シェア: X（Twitter）にシェアするボタン

## 環境変数

```
ANTHROPIC_API_KEY=...   # Vercel の Environment Variables に設定済み
```

ローカル開発時は `.env.local` に記載。

## デプロイ

```bash
vercel --prod
```

@CLAUDE.private.md
