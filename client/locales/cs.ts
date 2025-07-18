export default {
  validations: {
    required: "Pole je povinné",
    email: "Neplatný e-mail",
    numberic: "Musí být číslo",
    minLength: "Musí mít alespoň {length} znaků.",
    maxLength: "Nesmí mít více než {length} znaků.",
    minValue: "Musí být alespoň {value}.",
    sameAs: "Musí být stejné jako {otherName}",
    someFieldsAreIncorrect: "Některá pole nejsou vyplněna správně.",
    url: "Odkaz je neplatný.",
    notUrl: "Nesmí to být odkaz.",
    streamerSlug:
      "Cesta může obsahovat pouze malá písmena, čísla, podtržítka a pomlčky.",
    moneroPrimaryAddress: "Primární adresa je neplatná. Musí začínat číslem 4.",
  },

  account: "Účet",
  logout: "Odhlásit se",
  login: "Přihlásit se",
  send: "Odeslat",
  email: "E-mail",
  search: "Hledat",
  password: "Heslo",
  confirm: "Potvrdit",
  reconnect: "Znovu připojit",
  confirmPassword: "Potvrďte heslo",
  signupInstead: "Zaregistrovat se místo toho",
  signupFailed: "Registrace selhala",
  noItems: "Žádné položky",
  signupSuccessfull: "Registrace byla úspěšná",
  signupSuccessfullDescription:
    "Klikněte na odkaz zaslaný na váš e-mail pro ověření účtu.",
  loginInstead: "Přihlásit se místo toho",
  loginFailed: "Přihlášení selhalo",
  signup: "Registrovat se",
  forgetPassword: "Zapomenuté heslo?",
  loginDescription: "Přihlaste se ke svému účtu pro přístup ke své stránce.",
  resetPassword: "Obnovit heslo",
  enterYourNewPassword: "Zadejte nové heslo",
  passwordResetFailed: "Obnovení hesla selhalo",
  passwordUpdated: "Vaše heslo bylo úspěšně aktualizováno.",
  weSentYouAnEmail:
    "Zaslali jsme vám e-mail na adresu {email}, prosím následujte odkaz v e-mailu pro resetování hesla.",
  changeEmail: "Změnit e-mail",
  enterEmailToResetPassword: "Zadejte svůj e-mail pro resetování hesla.",
  creatorLogin: "Přihlášení pro tvůrce",
  searchCreators: {
    title: "Hledat tvůrce",
    description: "Hledejte tvůrce s veřejnými stránkami na xmrchat.",
  },
  typePageName: "Zadejte název stránky...",
  contactUs: "Kontaktujte nás",
  here: "zde",
  backToHome: "Zpět na domovskou stránku",
  somethingWentWrong: "Něco se pokazilo!",

  xmrchat: "XMRChat",
  heroDescription: "Podpořte svého oblíbeného streamera kryptoměnou.",
  findCreators: "Najít tvůrce",
  creatorsStartHere: "Tvůrci začínají zde",

  FAQ: {
    title: "Často kladené dotazy",
    whyTipWithXMRChat: "Proč používat právě XMRChat?",
    howToUseXMRChat: "Jak používat XMRChat?",
    whyUseMonero: "Proč XMRChat používá Monero?",
    whereToGetMonero: "Kde získat Monero?",
  },

  earnMore: {
    title: "Vydělejte více",
    description:
      "YouTube si účtuje 30–50 % za Superchats. Rumble 20 % za Rants. S XMRChat dostáváte 100 % XMR tipů přímo do vaší Monero peněženky.",
  },
  censorshipResistant: {
    title: "Odolné vůči cenzuře",
    description:
      "Přijímáním tipů v Monero získáte příjem nezávislý na velkých technologických firmách a jejich svévolných pravidlech.",
  },
  corruptionResistant: {
    title: "Odolné vůči korupci",
    description:
      "Mnohé režimy zabavují nebo zmrazují účty svých odpůrců. Monero vám umožní být vlastní bankou s plnou kontrolou nad financemi.",
  },
  private: {
    title: "Ochrana soukromí",
    description:
      "Diváci mohou tipovat anonymně, bez obav, že se to dozví zaměstnavatel nebo jiní.",
  },
  quickAndEasy: {
    title: "Rychlé a snadné",
    description:
      "Není třeba vytvářet účet, ověřovat e-mail nebo zadávat údaje o kartě. Fanoušci navštíví vaši stránku, zadají jméno, zprávu, částku a odešlou XMR.",
  },
  openSource: {
    title: "Open Source",
    description: "XMRChat je open source. Kód si můžete prohlédnout {github}.",
  },

  lowFees: {
    title: "Nízké poplatky",
    description: "Poplatky za transakce v Monero jsou jen pár haléřů.",
  },
  privateMonero: {
    title: "Soukromé",
    description:
      "Na rozdíl od většiny kryptoměn, Monero skrývá informace o transakcích. Odesílatel, příjemce ani částky nejsou veřejně dostupné.",
  },
  accepted: {
    title: "Akceptované",
    description:
      "Vyhněte se prodeji kryptoměn na centralizovaných burzách. Raději nakupujte přímo u obchodníků, kteří přijímají Monero na {xmrbazaar} a {monerica}.",
  },
  andMore: {
    title: "A mnoho dalšího",
    description:
      "Více o Moneru zjistíte na {getmonero} a o jeho využití na {moneroeco}.",
  },
  forContentCreators: {
    title: "Pro tvůrce obsahu",
    description: {
      main: `Klikněte na tlačítko "Tvůrci začínají zde". Vytvořte si účet na XMRChat. Vytvořte Tip stránku. Sdělte svému publiku její URL.`,
      tutorialLink:
        "Alex Anarcho má skvělý návod jak používat XMRChat na {youtube}.",
      ifStreamyard: "Pokud používáte Streamyard:",
      ifOBS: "Pokud používáte OBS:",
      streamyard: `Jděte do nabídky "Upravit tip stránku". Ujistěte se, že jste přidali uživatelské jméno Twitch kanálu. Při spuštění streamu ve Streamyard přidejte Twitch jako cíl. XMRChat bot (xmr-chat na twitchi) odešle tip zprávy na Twitch a můžete je zobrazit na obrazovce přes Streamyard. Nejlépe vypadá s nastavením "Minimal".`,
      obs: `Přejděte do položky "OBS". Klikněte na "Zkopírovat odkaz na OBS stránku". V OBS přidejte zdroj prohlížeče a vložte odkaz.`,
    },
  },
  forFans: {
    title: "Pro fanoušky",
    description:
      "Přejděte na stránku pro tipy tvůrce. Zadejte svou přezdívku a zprávu, vyberte částku a odešlete. Zobrazí se dialog s podrobnostmi. Váš xmrchat se pak po odeslání částky zobrazí na stránce streamera.",
  },
  whereToGetMonero: {
    cakeWallet: "Kupte nebo směňte kryptoměny za Monero v {cakeWallet}.",
    stealthex:
      "Směňte kryptoměny za Monero (XMR) na {stealthex} nebo {kycnot}.",
    haveno: "Kupte Monero bez KYC na {haveno}.",
    kraken: "Kupte Monero s KYC na {kraken}.",
    xmrbazaar: "Prodávejte zboží nebo služby za Monero na {xmrbazaar}.",
    gupax: "Těžte Monero pomocí {gupax}.",
    kunoAnneMedia: "Začněte fundraising v Monero na {kunoAnneMedia}.",
    monerica:
      "Přijímejte Monero ve svém podniku a buďte zveřejněni na stránkách {monerica}, {monerodirectory} a na mapě obchodních nabídek na {xmrbazaar} a {bankexit}.",
  },

  tipName: "Jméno",
  tipAmount: "Částka",
  tipMessage: "Zpráva",
  tipPrivate: "Soukromé",
  tipDate: "Datum",
  tipUpdated: "Tip byl aktualizován!",
  tipPrivateTooltip: "Jméno a zpráva budou viditelné pouze pro streamera.",
  tipCoin: "Měna",
  tipCoinPlaceholder: "XMR",
  sendTip: "Odeslat tip",
  tipCreationFailed: "Nepodařilo se vytvořit tip",
  tipNamePlaceholder: "Zadejte jméno",
  tipAmountPlaceholder: "Zadejte částku",
  tipMessagePlaceholder: "Zadejte zprávu",
  tipPrivatePlaceholder: "Soukromé",
  tipSwapUnavailable: "Směna je momentálně nedostupná.",
  tipSwapMinimum: "Minimálně {min} pro směnu",
  tipMinimum: "Minimální částka {min}",
  recentTips: "Nedávné tipy",
  tipDisplayValueTooltip: "Zobrazit tipy v XMR nebo {fiat}",
  noRecentTips: "Žádné nedávné tipy!",
  pageDeactivatedAlert:
    "Vaše stránka byla deaktivována a není veřejně viditelná. Kontaktujte prosím podporu pro více informací.",

  tipWalletWarningTitle: "Neposílejte tip ze streamer peněženky.",
  tipWalletWarningDescription:
    "Vyhněte se prosím odesílání tipů z peněženky registrované na stránce. Vrácené drobné zkreslují přijatou částku.",
  tipWalletMinimum:
    "Odešlete prosím minimálně {minimumAmount} XMR na následující adresu, aby se vaše zpráva zobrazila na xmrchat.",
  partialAmountReceived:
    "{partialAmount} dosud přijato, odešlete prosím zbývající {remainingAmount}.",
  openInMyWallet: "Otevřít v mé peněžence",
  cancel: "Zrušit",
  copyAddress: "Kopírovat adresu",
  waitingForPayment: "Čekání na platbu",

  contactUsDescription:
    "Kontaktujte nás s jakýmikoli dotazy nebo zpětnou vazbou.",
  contactUsForm: "Kontaktní formulář",
  contactUsFormDescription:
    "Kontaktujte nás s jakýmikoli dotazy nebo zpětnou vazbou.",
  contactUsFormButton: "Kontaktujte nás",
  emailUsDirectly: "Napište nám přímo na e-mail",
  followUsOnTwitter: "Sledujte nás na Twitteru",
  twitter: "Twitter",

  // CREATE PAGE
  createPage: "Vytvořit stránku",
  getStartedCreatingPage: "Začněte vytvořením své streamer stránky",
  home: "Domů",
  logo: "Logo",
  logoRatio: "Poměr stran 1:1",
  bannerImage: "Banner obrázek",
  bannerImageBestRatio: "Nejlépe nahrát v poměru 3:1",
  yourId: "Vaše ID",
  pageSlug: "Označení stránky (slug)",
  moneroPrmReciveAddress: "Primární přijímací adresa Monera",
  prmMoneroReciveAdressBegin: "Primární Monero adresy začínají číslem 4.",
  moneroSecretViewKey: "Tajný prohlížecí klíč Monera",
  weNeedSecretViewKey:
    "Potřebujeme prohlížecí klíč, abychom mohli zobrazit příchozí transakce od diváků. {whereToFind}",
  whereToFindViewKey: "Kde najít prohlížecí klíč?",
  twitchChannelName: "Název Twitch kanálu",
  nameOfYourTwitchChannel:
    "Název vašeho Twitch kanálu. Používá se k zobrazování tipů na streamu přes bota xmr_chat.",
  optional: "Volitelné",
  minTipAmount: "Min. částka tipu (XMR)",
  defaultTipAmount: "Výchozí hodnota tipu",
  thisIsOnlyForDisplaying:
    "Slouží pouze k zobrazení částky tipu. Diváci si mohou částku upravit sami na stránce s tipem.",
  publicPage: "Veřejná stránka (Zobrazí se ve vyhledávání tvůrců).",
  continue: "Pokračovat",
  clickToUpload: "Klikněte pro nahrání",
  pageCreatedSuccessfully: "Stránka byla úspěšně vytvořena!",
  slugReservedUntil: "Vaše označení je rezervováno do ",
  note: "Poznámka",
  pageUpdated: "Stránka byla aktualizována!",
  loading: "Načítání",
  available: "Dostupné",
  unavailable: "Nedostupné",
  fiatUnit: "Fiat měna",
  fiatUnitHelp: "Měna pro zobrazení tipů při přepnutí do fiat módu.",
  tipExpiration: "Expirace tipu",
  tipExpirationHelp: "Tipy budou automaticky odstraněny po stanovené době.",
  tipExpirationWarning:
    "Změna expirace smaže všechny xmrchats starší než vybraná doba.",
  disappearsX: "Zmizí za {time}",
  never: "Nikdy",
  xDays: "{count} den | {count} dnů",
  xMonths: "{count} měsíc | {count} měsíců",
  paymentIsExpired:
    "Platba vypršela. Pokud jste již platbu provedli, kontaktujte podporu.",
  pageReservationExpired: "Rezervace stránky vypršela.",
  paymentCheckingDis: "Ověřování platby bylo přerušeno.",
  ifPaymentMade: "Pokud již byla platba provedena, zobrazí se v seznamu tipů.",

  // STREAMER MENU
  menu: "Menu",
  myXmrchats: "Moje XMRChaty",
  editTipPage: "Upravit stránku s tipy",
  tipPage: "Stránka s tipy",
  contentLinks: "Odkazy na obsah",
  obs: "OBS",
  show: "Zobrazit",
  hide: "Skrýt",
  youDontHavePage: "Zatím nemáte žádnou stránku",
  getStartedByCreatingPage: "Začněte vytvořením nové stránky",
  createNewWallet:
    "Prosím, vytvořte novou peněženku Monero pro použití s XMRChat. Potřebujeme vidět pouze transakce související se zprávami v XMRChat, nic jiného.",
  createNewPage: "Vytvořit novou stránku",

  // ACCOUNT PAGE
  changePassword: "Změnit heslo",
  updateYourLoginPassword: "Aktualizujte své přihlašovací heslo",
  currentPassword: "Současné heslo",
  newPassword: "Nové heslo",
  repeatNewPassword: "Zopakujte nové heslo",
  contactSupportForEmailChange:
    "Pro změnu e-mailové adresy kontaktujte podporu.",

  // EDIT PAGE
  editPage: "Upravit stránku",
  customizeYourTipPage: "Přizpůsobte si svou stránku s tipy.",
  errorCreatingUpdatingPage: "Chyba při vytváření/aktualizaci stránky",
  tipAmountSuggestions: "Návrhy částek pro tipy",
  pageWillBeAvailableAt: "Vaše stránka bude dostupná na {url}",
  noSuggestedAmountsAdded:
    "Nejsou přidány žádné navrhované částky. Kliknutím na tlačítko níže přidáte nové úrovně.",
  addTier: "Přidat úroveň",
  remove: "Odstranit",
  name: "Název",
  amountUSD: "Částka (USD)",
  amountFiat: "Částka ({fiat})",

  // CONTENT LINKS
  brandName: "Název značky",
  brandNameHelp: "Název značky/obsahu. Může se lišit od slugu.",
  searchTerms: "Vyhledávací výrazy",
  searchTermsHelp:
    "Vyhledávání tvůrců bude probíhat podle slugu, názvu a klíčových slov v tomto seznamu.",
  contentLinksDescription: "Název, vyhledávací výrazy a odkazy na obsah",
  contentLinksSecondDescription:
    "Odkazy na vaše sociální sítě nebo webové stránky. Chcete-li pole vymazat, nechte jej prázdné.",
  saveChanges: "Uložit změny",
  notUrlWithMessage: "Zadejte pouze název, ne celý odkaz.",
  changesAreSaved: "Změny byly uloženy.",
  errorSavingChanges: "Chyba při ukládání změn.",
  xUsername: "{platform} uživatelské jméno",
  websiteLink: "Odkaz na web",
  youtubeChannel: "YouTube kanál",
  podcastRssLink: "Podcast RSS odkaz",
  nostrPubKey: "Veřejný klíč Nostr",

  //   OSB
  obsDescription: "OBS widget a nastavení.",
  settingsAreUpdated: "Nastavení bylo aktualizováno.",
  errorUpdatingSettings: "Chyba při aktualizaci nastavení",
  toUseXMRchatsOnOBS:
    "Chcete-li používat XMRChat v OBS, zkopírujte odkaz na stránku OBS a přidejte jej jako 'Prohlížeč' v OBS Sources.",
  copyOBSLink: "Zkopírovat odkaz na stránku OBS",
  obsPageSettings: "Nastavení stránky OBS",
  preventMessagesFromFading: "Zabránit mizení zpráv",
  preventMessagesFromFadingDescription:
    "Pokud je aktivní, nejnovější tipy zůstávají na obrazovce. Jinak se zprávy zobrazují po dobu 60 sekund.",
  playSound: "Přehrát zvuk",
  playSoundDescription: "Přehraje zvuk na OBS stránce při přijetí nového tipu.",
  playSoundDescriptionLocal:
    "Pokud tuto funkci testujete lokálně v prohlížeči, klikněte na stránku po jejím otevření. Jinak prohlížeč kvůli absenci interakce zvuk nepřehraje.",
  autoShowTips: "Automaticky zobrazovat tipy",
  autoShowTipsDescription:
    "Pokud je aktivní, tipy se automaticky zobrazí na OBS stránce na 60 sekund.",

  // HEAD
  head: {
    description:
      "Diváci, posílejte zprávy a tipy snadno a soukromě. Streameři, zachovejte si téměř všechny své tipy místo odevzdání 30–50 % velkým technologickým firmám.",
    title: "Zprávy a tipy s Monerem",
    XMRChatTip: "XMRChat – Tip pro {path} s Monerem",
    tip: "Tip pro {path}",
  },
  moneroSuperchats: "Monero Superchats: XMRChat",
};
