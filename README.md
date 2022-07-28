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

4. To access the hook, through which you can access your current account, connect and disconnect methods etc:

````
import { useWalletContext } from "../../../hooks/web3Client";

const myComponent = () => {

  const { connect, disconnect, web3modalContext } = useWalletContext();
  const { address, isActive, web3Provider, provider } = web3modalContext;
  
return(
  //Render Code

  <button onClick = {connect}>Connect!</button>
);
}
````

5. That's it! You can import the hook anywhere in your application, the "connect" function opens up the modal to connect to your wallet!

