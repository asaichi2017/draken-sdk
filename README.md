<h1 align="center">Welcome to draken-sdk ð</h1>
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
  endpoint: 'https://draken.example.com/xxxxxx', // ç®¡çç»é¢ããåå¾ããREST API Endpoint URL,
  idToken: () => {
    // ç®¡çç»é¢ã§ç»é²ããé£æºãã¦ããIDãã­ãã¤ãã¼ã®id tokenãè¿ã(å¬éè¨­å®ã®åç»ã®å ´åå¿è¦ç¡ã)
  },
})
const videoRef = document.getElementById('video')
const player = draken.player(videoRef, {
  // åçéåº¦å¤æ´ãã¿ã³ãéè¡¨ç¤ºã«ãã
  enablePlaybackRates: false,
  // åç»ã®åçåéæ©è½ãç¡å¹ã«ãã
  enablePlaybackResume: false,
  // <video> DOMã®ãµã¤ãºã®æå®
  // 'fill': è¦ªDOMã®ãµã¤ãºã«åããã
  // 'fluid': è¦ªDOMã®æ¨ªå¹ã¨videoã®æ¨ªå¹ãåããã
  // 'none': æå®ãªã(èªåã§ã«ã¹ã¿ãã¤ãºããå ´å)
  layout: 'fill',
  // åç»ã­ã¼ãå¾ã®ä¸­å¤®ã®åçãã¿ã³ãéè¡¨ç¤ºã«ãã
  bigPlayButton: false,
  // åç»ä¸é¨ã®ã³ã³ãã­ã¼ã«é¡ãå¨ã¦éè¡¨ç¤ºã«ãã
  controlBar: false,
})
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
  endpoint: 'https://draken.example.com/xxxxxx', // ç®¡çç»é¢ããåå¾ããREST API Endpoint URL,
  idToken: () => {
    // ç®¡çç»é¢ã§ç»é²ããé£æºãã¦ããIDãã­ãã¤ãã¼ã®id tokenãè¿ã(required)
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
  (progressInfo) => {
    // progressInfoãlocalStorageãªã©ã«ä¿å­ãã¦ãããã¨ã§ã¢ããã­ã¼ããä¸­æ­ããã¦ãåéã§ãã
    // è©³ç´°ã¯resumeUploadãåç§
  }
)

```

### Resume Upload

```typescript
import draken from 'draken-sdk'
draken.configure({
  endpoint: 'https://draken.example.com/xxxxxx', // ç®¡çç»é¢ããåå¾ããREST API Endpoint URL,
  idToken: () => {
    // ç®¡çç»é¢ã§ç»é²ããé£æºãã¦ããIDãã­ãã¤ãã¼ã®id tokenãè¿ã(required)
  },
})
const result = await draken.resumeUpload(
  file,
  progressInfo, // createãresumeUploadãå®è¡ããéã«ä¿å­ãã¦ããã`progressInfo`ãæå®ãã
  ({ loaded, total }) => {
    // progress
  },
  (progressInfo) => {
    // createã¨åæ§
  }
)
```

### ReUpload

```typescript
import draken from 'draken-sdk'
draken.configure({
  endpoint: 'https://draken.example.com/xxxxxx', // ç®¡çç»é¢ããåå¾ããREST API Endpoint URL,
  idToken: () => {
    // ç®¡çç»é¢ã§ç»é²ããé£æºãã¦ããIDãã­ãã¤ãã¼ã®id tokenãè¿ã(required)
  },
})
const result = await draken.resumeUpload(
  contentId,
  {
    quality: 'default',
    originalFileName: 'video_file_name.mp4',
  },
  file,
  ({ loaded, total }) => {
    // progress
  },
  (progressInfo) => {
    // createã¨åæ§
  }
)
```

### Update Content

```typescript
import draken from 'draken-sdk'
draken.configure({
  endpoint: 'https://draken.example.com/xxxxxx', // ç®¡çç»é¢ããåå¾ããREST API Endpoint URL,
  idToken: () => {
    // ç®¡çç»é¢ã§ç»é²ããé£æºãã¦ããIDãã­ãã¤ãã¼ã®id tokenãè¿ã(required)
  },
})
const result = await draken.update(
  contentId,
  {
    name: 'Content Name',
    description: 'Content Description',
    privacy: 'public',
    fromTime: '2000-01-01T00:00:00.000Z',
    toTime: '2000-01-02T00:00:00.000Z',
  }
)
```

### Get Content

```typescript
import draken from 'draken-sdk'
draken.configure({
  endpoint: 'https://draken.example.com/xxxxxx', // ç®¡çç»é¢ããåå¾ããREST API Endpoint URL,
  idToken: () => {
    // ç®¡çç»é¢ã§ç»é²ããé£æºãã¦ããIDãã­ãã¤ãã¼ã®id tokenãè¿ã(required)
  },
})
const content = await draken.get(contentId)
```

### Delete Content

```typescript
import draken from 'draken-sdk'
draken.configure({
  endpoint: 'https://draken.example.com/xxxxxx', // ç®¡çç»é¢ããåå¾ããREST API Endpoint URL,
  idToken: () => {
    // ç®¡çç»é¢ã§ç»é²ããé£æºãã¦ããIDãã­ãã¤ãã¼ã®id tokenãè¿ã(required)
  },
})
await draken.delete(contentId)
```

### Download Video

```typescript
import draken from 'draken-sdk'
draken.configure({
  endpoint: 'https://draken.example.com/xxxxxx', // ç®¡çç»é¢ããåå¾ããREST API Endpoint URL,
  idToken: () => {
    // ç®¡çç»é¢ã§ç»é²ããé£æºãã¦ããIDãã­ãã¤ãã¼ã®id tokenãè¿ã(required)
  },
})
const url = await draken.downloadVideo(contentId)
```

### Upload Thumbnail

```typescript
import draken from 'draken-sdk'
draken.configure({
  endpoint: 'https://draken.example.com/xxxxxx', // ç®¡çç»é¢ããåå¾ããREST API Endpoint URL,
  idToken: () => {
    // ç®¡çç»é¢ã§ç»é²ããé£æºãã¦ããIDãã­ãã¤ãã¼ã®id tokenãè¿ã(required)
  },
})
await draken.uploadThumbnail(contentId, file)
```

## Author

ð¤ **Asaichi, LLC. <taichi@asaichi.co.jp> (https://asaichi.co.jp/)**

* Github: [@asaichi2017](https://github.com/asaichi2017)

## Show your support

Give a â­ï¸ if this project helped you!

## ð License

Copyright Â© 2022 [Asaichi, LLC. <taichi@asaichi.co.jp> (https://asaichi.co.jp/)](https://github.com/asaichi2017).<br />
This project is [Apache--2.0](https://github.com/asaichi2017/draken-sdk/blob/master/LICENSE) licensed.

***
_This README was generated with â¤ï¸ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
