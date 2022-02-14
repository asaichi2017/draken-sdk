# react

## 環境構築

```sh
cp .env{,.local}
vi .env.local

yarn dev
```

## 注意点

Auth0 のアプリケーションの`Settings`で`Application URIs`セクションの`Allowed Callback URLs`に`http://localhost:8080`を入れておくこと
