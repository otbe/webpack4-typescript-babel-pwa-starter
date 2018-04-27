# Webpack4 + Typescript + Babel + CSS Modules + PWA Starter

A simple (hopefully) state of the art starter.
It includes:

* webpack4
* babel + TypeScript
* CSS Modules (incl. TypeScript support)
* HMR (via [react-hot-loader](https://github.com/gaearon/react-hot-loader))
* manifest.json (via [webpack-pwa-manifest](https://github.com/arthurbergmz/webpack-pwa-manifest))
* ServiceWorker (via [offline-plugin](https://github.com/NekR/offline-plugin))
* critical css (via [html-critical-webpack-plugin](https://github.com/anthonygore/html-critical-webpack-plugin))
* prerendering of routes (via [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin)) see [package.json](./package.json)

Lighthouse score 99 (perf)

## How to run

`$ yarn`  
`$ yarn watch`

Production build:  
`$ yarn build`

Use [serve](https://www.npmjs.com/package/serve) to serve your build:  
`$ serve -c 0 -s -p 8080 dist/`

## Want to improve?

I'm happy to accept some PRs to get a higher lighthouse score. :)
