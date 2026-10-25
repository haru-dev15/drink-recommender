import { DRINKS } from './drinks';
import type { Preferences } from './preferences';

export type CategoryFilter = 'all' | 'coffee' | 'tea' | 'japanese' | 'chinese';

const BODY_LABEL = { light: 'ライト', medium: 'ミディアム', full: 'フル' };
const ACIDITY_LABEL = { bright: '高め', mild: '中程度', low: '低め' };

type ShopSnack = { name: string; drinks: string[] };

export function buildPrompt(
  moods: string[],
  conditions: string[],
  prefs?: Preferences,
  freeText?: string,
  categoryFilter?: CategoryFilter,
  shopSnacks?: ShopSnack[],
  featuredDrinks?: string[],
): string {
  const moodText = moods.length > 0 ? moods.join('、') : 'とくになし';
  const conditionText = conditions.length > 0 ? conditions.join('、') : 'とくになし';
  const likedText = prefs?.liked.length ? `過去に「良かった」と評価した飲み物: ${prefs.liked.slice(0, 5).join('、')}` : '';
  const dislikedText = prefs?.disliked.length ? `過去に「合わなかった」と評価した飲み物: ${prefs.disliked.slice(0, 5).join('、')}` : '';

  const byOwned = prefs?.ownedDrinks?.length
    ? DRINKS.filter(d => prefs.ownedDrinks.includes(d.name))
    : DRINKS;
  const filteredDrinks = categoryFilter && categoryFilter !== 'all'
    ? byOwned.filter(d => d.category === categoryFilter)
    : byOwned;

  const drinkList = filteredDrinks.map((d, i) => {
    const pairingList = d.pairings.map(p => `${p.name}${p.emoji}`).join('、');
    return `[${i + 1}] ${d.name}（カフェイン:${d.caffeine} / ボディ:${BODY_LABEL[d.body]} / 酸味:${ACIDITY_LABEL[d.acidity]}）\n  性質: ${d.properties.join('、')}\n  向いている: ${d.goodFor.join('、')}\n  避けたい時: ${d.notGoodFor.join('、') || 'なし'}\n  淹れ方: ${d.brewingNote}\n  合うお菓子: ${pairingList}`;
  }).join('\n\n');

  const freeTextSection = freeText
    ? `\n自由記入（ユーザーの言葉）: 「${freeText}」\n※ この自由記入は最優先で考慮すること。`
    : '';

  const featuredSection = featuredDrinks?.length
    ? `\n【今日のおすすめ（お店が推したい飲み物）】\n${featuredDrinks.join('、')}\n※ 他の選択肢と同程度に合う場合は、上記から優先的に選ぶこと。ただし体調・気分と明らかに合わない場合は選ばない。\n`
    : '';

  const shopSnacksSection = shopSnacks?.length
    ? (() => {
        const lines = shopSnacks.map(s =>
          s.drinks.length > 0
            ? `・${s.name}（特に${s.drinks.join('・')}と合う）`
            : `・${s.name}（どの飲み物にも合う／AIが判断）`
        ).join('\n');
        return `\n【お店にあるお菓子】\n${lines}\n※ お菓子は必ずこのリストの中から選ぶこと。飲み物が指定されているお菓子は、その飲み物が選ばれた場合に優先すること。\n`;
      })()
    : '';

  const drinkReasonInstruction = freeText
    ? 'drinkReasonには、(1)ユーザーが自由記入した内容に具体的に触れながら、(2)その飲み物の主要な有効成分（L-テアニン・カフェイン・カテキン・ポリフェノール・香気成分等）とその科学的作用を1つ以上言及しつつ、なぜ今この飲み物が合うかを説明する（2〜3文、です・ます調）'
    : 'drinkReasonには、(1)今日の気分・体調と飲み物の相性を具体的に説明しながら、(2)その飲み物の主要な有効成分（L-テアニン・カフェイン・カテキン・ポリフェノール・香気成分等）とその科学的作用を1つ以上言及すること（2〜3文、です・ます調）';

  return `
あなたはSCA認定のコーヒーとティーの専門家です。
ユーザーの気分・体調に最も合う飲み物を、以下のリストの中から1つだけ選んでください。
そして、選んだ飲み物のお菓子を選んでください。

【ユーザーの状態】
気分: ${moodText}
体調: ${conditionText}${freeTextSection}

【選べる飲み物リスト】
${drinkList}

【ユーザーの好み履歴】
${likedText || '（まだ評価なし）'}
${dislikedText || ''}
${featuredSection}${shopSnacksSection}
【選び方のルール】
- 「向いている」キーワードとユーザーの状態が一致するものを優先する
- 「避けたい時」キーワードと一致する場合は絶対に選ばない
- カフェインが high または medium のものは「眠れない」「不安」「胃が重い」の人には選ばない
- 「合わなかった」飲み物は絶対に選ばない
- 「良かった」飲み物と同じカテゴリ・系統を優先するが、毎回同じにはしない
- ほうじ茶・玄米茶などの無難な選択より、状態に最も合う飲み物を積極的に選ぶ
- お菓子は【お店にあるお菓子】が指定されている場合は必ずそのリストから、指定がない場合は飲み物の「合うお菓子」リストから選ぶこと
- ペアリングの選択には「対比（甘み×苦み・酸味×甘みなど）」または「共鳴（香りの類似・産地の近さなど）」のどちらかの原理を意識すること

必ず以下のJSON形式のみで返してください（説明文・コードブロック不要）：
{
  "drink": "選んだ飲み物の正確な名前（リストの名前をそのまま使う）",
  "drinkEmoji": "絵文字1つ",
  "drinkReason": "${drinkReasonInstruction}",
  "brewingTip": "その飲み物の淹れ方のコツを1文（リストの「淹れ方」を参考に、です・ます調）",
  "snack": "選んだお菓子の名前",
  "snackEmoji": "そのお菓子の絵文字",
  "snackReason": "このお菓子と飲み物のペアリング原理（対比か共鳴か）に触れながら、今の気分との相性も説明（1〜2文、です・ます調）"
}
  `.trim();
}
