# draken-sdk

## セットアップ

```sh
yarn
# env設定
cp ./.env.development{,.local}
vi ./.env.development.local # 編集する
```

## player の動作確認

```sh
yarn dev
open http://localhost:3200
# `./src/main.ts`を参照
```

## create content のテスト

```sh
yarn dev
open http://localhost:3200/upload.html
# `./src/upload.ts`を参照
```
