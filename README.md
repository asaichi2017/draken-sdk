<h1 align="center">Welcome to draken-sdk 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/draken-sdk" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/draken-sdk.svg">
  </a>
  <a href="https://github.com/asaichi2017/draken-sdk#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/asaichi2017/draken-sdk/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
</p>

> Draken SDK

## Install

```sh
yarn install
```

## Usage

### player

If you want to write using Reactjs, please refer to [React Sample](./samples/react).

player.ts
```typescript
import draken from 'draken-sdk'
draken.configure({
  endpoint: 'https://draken.example.com/xxxxxx', // 管理画面から取得したREST API Endpoint URL,
  idToken: () => {
    // 管理画面で登録した連携しているIDプロバイダーのid tokenを返す(公開設定の動画の場合必要無い)
  },
})
const videoRef = document.getElementById('video')
const player = draken.player()
player.load(contentID)

```

player.html
```html
<video id="video"></video>
```

### Create Content (upload)
upload.ts
```typescript
import draken from 'draken-sdk'
draken.configure({
  endpoint: 'https://draken.example.com/xxxxxx', // 管理画面から取得したREST API Endpoint URL,
  idToken: () => {
    // 管理画面で登録した連携しているIDプロバイダーのid tokenを返す(required)
  },
})
const result = await draken.create(
  {
    name: 'Content Name',
    privacy: 'public',
    quality: 'high',
    description: 'Content Description',
  },
  file, // File
  ({ loaded, total }) => {
    // progress
  },
)

```


## Author

👤 **Asaichi, LLC. <taichi@asaichi.co.jp> (https://asaichi.co.jp/)**

* Github: [@asaichi2017](https://github.com/asaichi2017)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2022 [Asaichi, LLC. <taichi@asaichi.co.jp> (https://asaichi.co.jp/)](https://github.com/asaichi2017).<br />
This project is [Apache--2.0](https://github.com/asaichi2017/draken-sdk/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
