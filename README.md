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

!!! 実際に DynamoDB に保存します

```sh
vi ./.env.development.local
# VITE_ENDPOINTとVITE_ADMIN_TOKENを編集する
sed -i -E "s/^describe\.skip/describe.only/" ./test/createContent.test.ts
yarn test
sed -i -E "s/^describe\.only/describe.skip/" ./test/createContent.test.ts
```
