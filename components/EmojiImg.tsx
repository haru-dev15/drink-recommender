type Props = {
  emoji: string;
  size?: number;
  className?: string;
};

function toTwemojiUrl(emoji: string): string {
  const codePoints = [...emoji]
    .map(c => c.codePointAt(0)!)
    .filter(n => n !== 0xfe0f) // variation selector を除外
    .map(n => n.toString(16));
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codePoints.join('-')}.svg`;
}

export default function EmojiImg({ emoji, size = 32, className = '' }: Props) {
  return (
    <img
      src={toTwemojiUrl(emoji)}
      alt={emoji}
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  );
}
