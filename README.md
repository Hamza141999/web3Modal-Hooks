# web3Modal-Hooks

web3Modal is a library which provides a gateway to easily connect crypto wallets in your DApp
This repo contains hooks and useReducers which setup web3Modal in your DApp

# Steps

1. Install web3Modal

````
yarn add web3modal

#OR

npm install --save web3modal
````

2. Paste the "web3Client.js" and "web3Provider.js" files in the root of your project

3. Import ContextAPI provider "UseWeb3Provider" in your _app.js or index.js file. Wrap it around the parent component of your project.
````
#_app.js

import { UseWeb3Provider } from "../hooks/web3Client";

function MyApp({ Component, pageProps }) {
  return (
      <UseWeb3Provider>
          <Component {...pageProps} />
      </UseWeb3Provider>
  );
}

export default MyApp;
````

