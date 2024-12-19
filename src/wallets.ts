import { createWallet, inAppWallet } from "thirdweb/wallets";

const wallets = [
    inAppWallet({
      auth: {
        options: [
          "google",
          "email",
          "phone",
          "facebook",
          "apple",
          "discord",
          "telegram",
          "farcaster",
          "x",
          "passkey",
        ],
        redirectUrl: window.location.origin,
      },
    }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
  ];

  export default wallets;