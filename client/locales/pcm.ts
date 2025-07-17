export default {
  validations: {
    required: "Dis field na must",
    email: "Email no correct",
    numberic: "Suppose be number",
    minLength: "E suppose get {length} character at least.",
    maxLength: "E no suppose pass {length} character.",
    minValue: "E suppose be {value} at least.",
    sameAs: "E suppose be di same as {otherName}",
    someFieldsAreIncorrect: "Some field dem, no correct.",
    url: "Di link no correct.",
    notUrl: "E no suppose be link.",
    streamerSlug:
      "Na only lowercase letters, numbers, underscores and hyphens di path fi contain.",
    moneroPrimaryAddress:
      "The primary address no correct. E suppose start with the number 4.",
  },

  account: "Account",
  logout: "Log out",
  login: "Log in",
  send: "Send",
  email: "Email",
  search: "Search",
  password: "Password",
  confirm: "Confirm am",
  reconnect: "Try connect again",
  confirmPassword: "Confirm Password",
  signupInstead: "Do Signup instead",
  signupFailed: "Signup fail",
  signupSuccessfull: "Signup work",
  noItems: "No item dey",
  signupSuccessfullDescription:
    "Abeg check di link wey we send go your email to verify your account.",
  loginInstead: "Login instead",
  loginFailed: "Login no work",
  signup: "Signup",
  forgetPassword: "You forget your Password?",
  loginDescription: "Log into your account so you fi see your display page.",
  resetPassword: "Reset Password",
  enterYourNewPassword: "Enter your new password",
  passwordResetFailed: "Password Reset Fail",
  passwordUpdated: "Your password don updated successfully.",
  weSentYouAnEmail:
    "We don send you email {email}, please follow the link wey dey the email to reset your password.",
  changeEmail: "Change Email",
  enterEmailToResetPassword: "Enter your email so you fi reset your password.",
  creatorLogin: "Creator Login",
  searchCreators: {
    title: "Search Creators",
    description: "Find creators wey get xmrchat public page.",
  },
  typePageName: "Type page name...",
  contactUs: "Contact Us",
  here: "here",
  backToHome: "Go back to home",
  somethingWentWrong: "Wetin wey no correct happen!",

  xmrchat: "XMRChat",
  heroDescription: "Send crypto tip give your best streamer.",
  findCreators: "Find Creators",
  creatorsStartHere: "Creators go start here",

  FAQ: {
    title: "FAQ",
    whyTipWithXMRChat: "Wetin make I use XMRChat tip?",
    howToUseXMRChat: "How to use XMRChat?",
    whyUseMonero: "Why XMRChat dey use Monero?",
    whereToGetMonero: "Where I fi get Monero?",
  },

  earnMore: {
    title: "Make More Money",
    description:
      "YouTube dey collect 30-50% for Superchats. Rumble dey take 20% for Rants. But XMRChat go give you 100% of wetin your fans tip straight for your Monero wallet.",
  },
  censorshipResistant: {
    title: "No Censorship Wahala",
    description:
      "If you dey collect Monero tip, e mean say your money no go depend on big tech policy or their wahala.",
  },
  corruptionResistant: {
    title: "No Corruption Palava",
    description:
      "Plenty government dey seize people money. With Monero, na you dey control your own money.",
  },
  private: {
    title: "Private",
    description:
      "People fi send tip and nobody go sabi. Even your work people no go know.",
  },
  quickAndEasy: {
    title: "Fast and Easy",
    description:
      "No need make person create account or enter card info. Just enter name, message, amount and send tip sharparly.",
  },
  openSource: {
    title: "Open Source",
    description:
      "XMRChat na open source. You fit check di source code for {github}.",
  },

  lowFees: {
    title: "Small Charges",
    description: "Monero transaction fee na just shikini money.",
  },
  privateMonero: {
    title: "Private",
    description:
      "Most crypto dey show everything for blockchain, but Monero dey hide everything. Nobody go sabi sender, receiver or amount.",
  },
  accepted: {
    title: "E Dey Accepted",
    description:
      "No need sell your crypto for exchange. You fi use Monero buy things directly from {xmrbazaar} and {monerica}.",
  },
  andMore: {
    title: "And more",
    description: "You fi learn more about Monero for {getmonero}.",
  },

  whereToGetMonero: {
    cakeWallet: "Buy or change crypto for Monero inside {cakeWallet}.",
    stealthex:
      "Change your crypto go Monero (XMR) for {stealthex} and other places like {kycnot}.",
    haveno: "Buy Monero without KYC for {haveno}.",
    kraken: "Buy Monero with KYC for {kraken}.",
    xmrbazaar: "Sell things or service collect Monero for {xmrbazaar}.",
    gupax: "Mine Monero with {gupax}.",
    kunoAnneMedia: "Create Monero fundraiser for {kunoAnneMedia}.",
    monerica:
      "Collect Monero for your business and get listed for {monerica}, {monerodirectory}, and business map for {xmrbazaar} and {bankexit}.",
  },
  forContentCreators: {
    title: "For Content Creators",
    description: {
      main: `Click di "Creators Start Here" button. Create XMRChat account. Create Tip Page. Make your audience know di URL of your tip page.`,
      tutorialLink:
        "Alex Anarcho get one great tutorial on how to use XMRChat on {youtube}.",
      ifStreamyard: "If you dey use Streamyard:",
      ifOBS: "If you dey use OBS:",
      streamyard: `Go to "Edit tip page" menu. Make sure say you don add your Twitch channel name. When you start stream for Streamyard, add Twitch as destination. XMRChat bot (xmr-chat for Twitch) go send di tip message for Twitch and you fit show am for your screen from Streamyard. Di xmrchat bot logo go look better with "Minimal" setting.`,
      obs: `Go to "OBS" menu. Click on "Copy OBS Page Link". Add browser source for OBS and paste di link.`,
    },
  },
  forFans: {
    title: "For Fans",
    description:
      "Go to di URL of your content creator tip page. Type your name and message, choose tip amount, then send. One small box go show with di tip details. Your xmrchat go show for di streamer page after you don send di tip.",
  },

  // TIP PAGE
  tipName: "Name",
  tipAmount: "Amount",
  tipMessage: "Message",
  tipPrivate: "Private",
  tipDate: "Date",
  tipUpdated: "Tip don update!",
  tipPrivateTooltip: "Only the streamer go fit see your name and message.",
  tipCoin: "Coin",
  tipCoinPlaceholder: "XMR",
  sendTip: "Send Tip",
  tipCreationFailed: "Tip no work",
  tipNamePlaceholder: "Enter name",
  tipAmountPlaceholder: "Enter amount",
  tipMessagePlaceholder: "Enter message",
  tipPrivatePlaceholder: "Private",
  tipSwapUnavailable: "Swap no dey work for now.",
  tipSwapMinimum: "You must swap at least {min}",
  tipMinimum: "Minimum {min}",
  recentTips: "Recent Tips",
  tipDisplayValueTooltip: "Show tip as XMR or {fiat}",
  noRecentTips: "No recent tips!",
  pageDeactivatedAlert:
    "Your page don dey deactivated and e no dey show to di public. Abeg talk to support if you wan know more.",

  tipWalletWarningTitle: "No use streamer wallet tip.",
  tipWalletWarningDescription:
    "No use wallet wey you register for dis page send tip. E go make the amount wey we see plenty.",
  tipWalletMinimum:
    "Send at least {minimumAmount} XMR go dis address make your xmrchat for show.",
  partialAmountReceived:
    "{partialAmount} don receive so far, abeg send di remaining {remainingAmount}.",
  openInMyWallet: "Open am for My Wallet",
  cancel: "Cancel",
  copyAddress: "Copy Address",
  waitingForPayment: "We dey wait for payment",

  // CONTACT US PAGE
  contactUsDescription: "Reach us if you get question or feedback.",
  contactUsForm: "Contact Us Form",
  contactUsFormDescription: "Reach us if you get question or feedback.",
  contactUsFormButton: "Contact Us",
  emailUsDirectly: "Send email to us directly",
  followUsOnTwitter: "Follow us for Twitter",
  twitter: "Twitter",

  // CREATE PAGE
  createPage: "Create Page",
  getStartedCreatingPage: "Make you start by creating your streamer page",
  home: "Home",
  logo: "Logo",
  logoRatio: "1:1 ratio",
  bannerImage: "Banner Image",
  bannerImageBestRatio: "E better make you upload am in 3:1",
  yourId: "Your ID",
  pageSlug: "Page Slug",
  moneroPrmReciveAddress: "Monero main address wey go receive money",
  prmMoneroReciveAdressBegin:
    "Monero address wey dey collect money dey start with number 4.",
  moneroSecretViewKey: "Monero secret view key",
  weNeedSecretViewKey:
    "We need dis secret view key so you fi see money wey people dey send. {whereToFind}",
  whereToFindViewKey: "Where you fi find di view key?",
  twitchChannelName: "Twitch channel name",
  nameOfYourTwitchChannel:
    "Di name wey dey your Twitch channel. We go use am show tips with xmr_chat Twitch bot.",
  optional: "Optional",
  minTipAmount: "Smallest tip amount (XMR)",
  defaultTipAmount: "Default tip value",
  thisIsOnlyForDisplaying:
    "Na just for display sake. People wey wan tip fi change am for dia page.",
  publicPage: "Public Page (e go show for creator search page).",
  continue: "Continue",
  clickToUpload: "Click make you upload",
  pageCreatedSuccessfully: "Di page don create well!",
  slugReservedUntil: "Your slug go dey reserved until ",
  note: "Note",
  streamerSlugHelp:
    "Lowercase letters, numbers, underscores and hyphens na wetin this path fi contain.",
  moneroPrimaryAddressHelp:
    "The primary address no correct. E must begin with the number 4.",
  paymentIsExpired:
    "Payment don expire. If you don already pay, abeg contact support.",
  pageReservationExpired: "Di page wey you hold don expire.",
  paymentCheckingDis: "Di payment checking don cut off.",
  ifPaymentMade: "If you don pay, e go show for di tip list.",

  // STREAMER MENU
  menu: "Menu",
  myXmrchats: "My xmrchats",
  editTipPage: "Edit Tip Page",
  tipPage: "Tip Page",
  contentLinks: "Content Links",
  obs: "OBS",
  show: "Show",
  hide: "Hide",
  youDontHavePage: "You never get page yet",
  getStartedByCreatingPage: "You fi start by creating new page yourself",
  createNewPage: "Create New Page",

  // ACCOUNT PAGE
  changePassword: "Change Password",
  updateYourLoginPassword: "Update your login password",
  currentPassword: "Current password",
  newPassword: "New password",
  repeatNewPassword: "Repeat new password",
  contactSupportForEmailChange: "Contact if you wan change email address.",

  // EDIT PAGE
  editPage: "Edit Page",
  customizeYourTipPage: "Customize your tip page.",
  errorCreatingUpdatingPage: "Error dey wen creating/updating page",
  tipAmountSuggestions: "Tip Amount Suggestions",
  pageWillBeAvailableAt: "Your page go dey available for {url}",
  noSuggestedAmountsAdded:
    "No suggested amounts don add, Click the button below make you add new tiers.",
  addTier: "Add Tier",
  remove: "Remove",
  name: "Name",
  amountUSD: "Amount (USD)",
  amountFiat: "Amount ( {fiat} )",

  // CONTENT LINKS
  brandName: "Brand Name",
  brandNameHelp: "Name of the brand/content. E fi dey different from slug.",
  searchTerms: "Search Terms",
  searchTermsHelp:
    "Creator search go return results based on page slug, name, and keywords for this list.",
  contentLinksDescription: "Name, Search Terms and Content Links",
  contentLinksSecondDescription:
    "Links to your social pages or websites. To reset value make you leave the field empty.",
  saveChanges: "Save Changes",
  notUrlWithMessage: "Only enter the name, no be full link.",
  changesAreSaved: "Changes don save.",
  errorSavingChanges: "Error when dey save changes.",
  xUsername: "{platform} username",
  websiteLink: "Website link",
  youtubeChannel: "Youtube channel",
  podcastRssLink: "Podcast RSS Link",
  nostrPubKey: "Nostr Pub Key",
  xKuno: "Kuno fundraiser",

  // OBS
  obsDescription: "OBS widget and settings.",
  settingsAreUpdated: "Settings don update.",
  errorUpdatingSettings: "Error when dey update settings",
  toUseXMRchatsOnOBS:
    "To use XMRChat for OBS, copy the link to OBS page and add am for 'Browser' of OBS Sources.",
  copyOBSLink: "Copy OBS Page Link",
  obsPageSettings: "OBS Page Settings",
  preventMessagesFromFading: "Prevent messages from fading",
  preventMessagesFromFadingDescription:
    "When e dey active, e go keep the latest tips for screen, otherwise each message go show for 60 seconds.",
  playSound: "Play Sound",
  playSoundDescription: "Play sound for OBS page when new tip appear.",
  playSoundDescriptionLocal:
    "If you dey test this function for your browser, after you open the obs tab make sure say you click somewhere for the page. Otherwise browser no go play sound because no interaction with the open tab.",
  autoShowTips: "Auto Show Tips",
  autoShowTipsDescription:
    "If active, tips will be automatically shown on the OBS page for 60 seconds.",

  // HEAD
  head: {
    description:
      "People wey dey watch, fi send message and tip easy and private. Streamers fi hold most of dia tips instead make dem give 30-50% to big tech companies.",
    title: "Send Message and Tip with Monero",
    XMRChatTip: "XMRChat - Tip {path} with Monero",
    tip: "Tip {path}",
  },
  moneroSuperchats: "Monero Superchats : XMRChat",
};
