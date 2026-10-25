const KEY = 'tea-app-preferences';

export type Preferences = {
  liked: string[];
  disliked: string[];
  ownedDrinks: string[]; // 手持ち・メニューに登録した飲み物名（空=すべて対象）
};

export function getPreferences(): Preferences {
  if (typeof window === 'undefined') return { liked: [], disliked: [], ownedDrinks: [] };
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      liked: parsed.liked ?? [],
      disliked: parsed.disliked ?? [],
      ownedDrinks: parsed.ownedDrinks ?? [],
    };
  } catch {
    return { liked: [], disliked: [], ownedDrinks: [] };
  }
}

export function addLiked(drinkName: string): void {
  const prefs = getPreferences();
  if (!prefs.liked.includes(drinkName)) {
    prefs.liked = [drinkName, ...prefs.liked].slice(0, 20);
  }
  prefs.disliked = prefs.disliked.filter(d => d !== drinkName);
  localStorage.setItem(KEY, JSON.stringify(prefs));
}

export function addDisliked(drinkName: string): void {
  const prefs = getPreferences();
  if (!prefs.disliked.includes(drinkName)) {
    prefs.disliked = [drinkName, ...prefs.disliked].slice(0, 20);
  }
  prefs.liked = prefs.liked.filter(d => d !== drinkName);
  localStorage.setItem(KEY, JSON.stringify(prefs));
}

export function setOwnedDrinks(names: string[]): void {
  const prefs = getPreferences();
  prefs.ownedDrinks = names;
  localStorage.setItem(KEY, JSON.stringify(prefs));
}
