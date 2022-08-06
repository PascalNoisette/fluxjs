
## Overview

Responsive theme for [miniflux](https://github.com/miniflux/miniflux)




## Features

- login to your miniflux account
- browse feed in left menu
- responsive design (mobile, desktop)
- infinite scroll feeds
- performance to handle hunderds+ of rss feeds

## Screenshot

Demo : https://pascalnoisette.github.io/fluxjs

|Login|Left menu|Browse|
|---|---|---|
|![Screenshot - Login](./docs/login.png)|![Screenshot - Left menu](./docs/menu.png)|![Screen Reader](./docs/fluxjs.png)|





## Prepare your miniflux credential

If your miniflux homepage is https://miniflux.url/ you should generate an api key at https://miniflux.url/keys . You can connect to fluxjs with the url https://miniflux.url/ and the key. 

![Generate Miniflux key](./docs/apikey.png)



## Try with docker

```
docker run --rm -p 3000:80 netpascal0123/fluxjs:1.0.4
```

Open https://127.0.0.1:3355/ with your browser.

## Contribute

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Check code quality and production build :

```bash
yarn build
yarn start
```
