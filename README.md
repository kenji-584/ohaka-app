# 家のお墓帳 🪷

お墓・葬儀・法事の情報を記録し、次の世代へ引き継ぐためのアプリです。

---

## ローンチまでの手順

### ① このフォルダをGitHubにアップロードする

1. [github.com](https://github.com) でアカウントを作る
2. 右上の「＋」→「New repository」をクリック
3. 名前を「ohaka-app」にして「Create repository」
4. 「uploading an existing file」をクリックしてこのフォルダの中身を全部アップロード
5. 「Commit changes」ボタンを押す

### ② Vercelで公開する

1. [vercel.com](https://vercel.com) で「GitHubでログイン」
2. 「Add New Project」→ さっき作った「ohaka-app」を選ぶ
3. 「Deploy」ボタンを押すだけ！

数分後に `ohaka-app.vercel.app` のURLでアクセスできるようになります。

---

## Stripe（課金）を本番に繋ぐには

1. [stripe.com](https://stripe.com) で無料登録
2. ダッシュボードで「商品」→「月額480円」のプランを作成
3. 「決済リンク」を発行して `src/PricingPage.jsx` のボタンのURLに貼る

---

## 開発者向け（ローカルで動かす場合）

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開く。
