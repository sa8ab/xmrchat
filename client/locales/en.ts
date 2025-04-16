export default {
  validations: {
    required: "Field is required",
    email: "Email is invalid",
    numberic: "Should be a number",
    minLength: "Should be at least {length} characters.",
    maxLength: "Should not be more than {length} characters.",
    minValue: "Should be at least {value}.",
    sameAs: "Should be same as {otherName}",
    someFieldsAreIncorrect: "Some of the fields are not filled correctly.",
    url: "The link is invalid.",
    notUrl: "Should not be a link.",
  },

  account: "Account",
  logout: "Logout",
  login: "Login",
  email: "Email",
  search: "Search",
  password: "Password",
  confirmPassword: "Confirm Password",
  signupInstead: "Signup Instead",
  signupFailed: "Signup Failed",
  signupSuccessfull: "Signup Successfull",
  signupSuccessfullDescription:
    "Please follow the link sent to your email to verify your account.",
  loginInstead: "Login Instead",
  loginFailed: "Login Failed",
  signup: "Signup",
  forgetPassword: "Forget Password ?",
  loginDescription:
    "Login to your account in order to access your display page.",
  creatorLogin: "Creator Login",
  searchCreators: {
    title: "Search Creators",
    description: "Search creators with public pages on xmrchat.",
  },
  contactUs: "Contact Us",

  xmrchat: "XMRChat",
  heroDescription: "Tip your favorite streamer in cryptocurrency.",
  findCreators: "Find Creators",
  creatorsStartHere: "Creators Start Here",

  FAQ: {
    title: "FAQ",
    whyTipWithXMRChat: "Why tip with XMRChat?",
    whyUseMonero: "Why does XMRChat use Monero?",
    whereToGetMonero: "Where to get Monero?",
  },

  earnMore: {
    title: "Earn More",
    description:
      "YouTube charges 30-50% for Superchats. Rumble 20% for Rants. With XMRChat you receive 100% of your XMR tips from fans, directly to your Monero wallet.",
  },
  censorshipResistant: {
    title: "Censorship Resistant",
    description:
      "Accepting Monero tips allows you to have an income that is not directly connected to big tech and arbitrary policy violations.",
  },
  corruptionResistant: {
    title: "Corruption Resistant",
    description:
      "Many regimes seize or freeze bank accounts of political enemies. Monero allows you to be your own bank with complete control of your finances.",
  },
  private: {
    title: "Private",
    description:
      "Viewers can tip anonymously, no worries from employers or others knowing your donations.",
  },
  quickAndEasy: {
    title: "Quick And Easy",
    description:
      "No need for viewers to create an account, verify their email, or enter credit card info. Fans go to your tip page, type their name, message, amount, and submit their XMR tip.",
  },
  openSource: {
    title: "Open Source",
    description: "XMRChat is open source. You can review the code {github}.",
  },

  lowFees: {
    title: "Low fees",
    description: "Monero transaction fees are a few pennies at most.",
  },
  privateMonero: {
    title: "Private",
    description:
      "While most crypto uses open ledgers, Monero hides transaction data. Sender, receiver, and transaction amounts are not revealed by looking at the blockchain.",
  },
  accepted: {
    title: "Accepted",
    description:
      "Avoid the hassle of selling your crypto on a centralized exchange. Buy goods and services directly from merchants that accept Monero on {xmrbazaar} and {monerica}.",
  },
  andMore: {
    title: "And more",
    description: "Learn more about Monero at {getmonero}.",
  },

  whereToGetMonero: {
    cakeWallet: "Buy or trade other crypto for Monero in {cakeWallet}.",
    stealthex:
      "Trade other crypto for Monero (XMR) at {stealthex} and others at {kycnot}.",
    haveno:
      "Buy Monero without KYC at {haveno}. Cash by mail tutorial at {blog}.",
    kraken: "Buy Monero with KYC at {kraken}.",
    xmrbazaar: "Sell items or services for Monero at {xmrbazaar}.",
    gupax: "Mine it with {gupax}.",
    kunoAnneMedia: "Create a Monero Fundraiser at {kunoAnneMedia}.",
    monerica:
      "Accept Monero at your business and get listed at the {monerica} and {monerodirectory} pages and the business listings map on {xmrbazaar}.",
  },

  // TIP PAGE
  tipName: "Name",
  tipAmount: "Amount",
  tipMessage: "Message",
  tipPrivate: "Private",
  tipPrivateTooltip: "Name and message will be only visible to the streamer.",
  tipCoin: "Coin",
  tipCoinPlaceholder: "XMR",
  sendTip: "Send Tip",
  tipCreationFailed: "Tip Creation Failed",
  tipNamePlaceholder: "Enter name",
  tipAmountPlaceholder: "Enter amount",
  tipMessagePlaceholder: "Enter message",
  tipPrivatePlaceholder: "Private",
  tipSwapUnavailable: "Swap is currently unavailable.",
  tipSwapMinimum: "Minimum {minSwapUSD}$ to swap",
  minUsdAmount: "Minimum {minUsdAmount}",
  recentTips: "Recent Tips",
  tipDisplayValueTooltip: "Show tip values in XMR or USD",
  noRecentTips: "No recent tips!",

  tipWalletWarningTitle: "Do not tip with streamer wallet.",
  tipWalletWarningDescription:
    "Please avoid sending tips with wallet registered on the page. The change returned inflates the amount we see received.",
  tipWalletMinimum:
    "Please send a minimum {minimumAmount} XMR to the following address for your xmrchat to be displayed.",
  openInMyWallet: "Open in My Wallet",
  cancel: "Cancel",
  copyAddress: "Copy Address",
  waitingForPayment: "Waiting for payment",

  // CONTACT US PAGE
  contactUsDescription: "Contact us for any questions or feedback.",
  contactUsForm: "Contact Us Form",
  contactUsFormDescription: "Contact us for any questions or feedback.",
  contactUsFormButton: "Contact Us",
  emailUsDirectly: "Email us directly",
  followUsOnTwitter: "Follow us on Twitter",
  twitter: "Twitter",
};
