import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー — 今日の一杯',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#faf6f1] px-5 py-10">
      <div className="max-w-lg mx-auto">

        <Link href="/" className="text-xs text-[#a08060] hover:text-[#6b4c2a] mb-8 inline-block">
          ← 今日の一杯に戻る
        </Link>

        <h1 className="text-xl font-bold tracking-widest text-[#3b2a1a] mb-1">プライバシーポリシー</h1>
        <p className="text-xs text-[#a08060] mb-8">最終更新：2025年4月</p>

        <div className="space-y-7 text-sm text-[#4a3728] leading-relaxed">

          <section>
            <h2 className="font-bold text-[#3b2a1a] mb-2">1. 収集する情報</h2>
            <p>本アプリは以下の情報を扱います。</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-[#6b4c2a]">
              <li>入力された気分・体調・自由記入テキスト（AIへのリクエストに使用）</li>
              <li>飲み物の評価履歴（👍/👎）</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-[#3b2a1a] mb-2">2. 情報の保存場所</h2>
            <p>
              評価履歴はお使いのデバイスの <strong>ローカルストレージ</strong> にのみ保存されます。
              サーバーや外部データベースには一切送信・保存されません。
              ブラウザのデータを削除すると評価履歴も削除されます。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[#3b2a1a] mb-2">3. AIへの送信</h2>
            <p>
              入力された気分・体調・自由記入テキストは、飲み物を推薦するためにAnthropic社のClaude APIに送信されます。
              Anthropicのプライバシーポリシーについては
              <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer"
                className="underline text-[#a08060] ml-1">anthropic.com/privacy</a>
              をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[#3b2a1a] mb-2">4. 個人情報の入力について</h2>
            <p>
              氏名・住所・メールアドレスなどの個人情報の入力欄はありません。
              自由記入欄には個人を特定できる情報を入力しないようお願いします。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[#3b2a1a] mb-2">5. アクセス解析</h2>
            <p>
              本アプリはアクセス解析ツールを使用する場合があります。
              収集されるデータは匿名化された統計情報のみです。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[#3b2a1a] mb-2">6. お問い合わせ</h2>
            <p>
              プライバシーに関するご質問は、X（Twitter）の
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="underline text-[#a08060] ml-1">アカウント</a>
              までDMにてご連絡ください。
            </p>
          </section>

        </div>

        <div className="mt-10 pt-6 border-t border-[#ede8e0] text-center">
          <Link
            href="/"
            className="inline-block bg-[#3b2a1a] text-white text-sm font-bold px-8 py-3 rounded-2xl hover:bg-[#5a3e28] transition-colors tracking-wider"
          >
            今日の一杯を選ぶ
          </Link>
        </div>

      </div>
    </main>
  );
}
