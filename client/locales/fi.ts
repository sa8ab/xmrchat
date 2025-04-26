export default {
  validations: {
    required: "Kenttä on pakollinen",
    email: "Virheellinen sähköpostiosoite",
    numberic: "Täytyy olla numero",
    minLength: "Vähintään {length} merkkiä.",
    maxLength: "Enintään {length} merkkiä.",
    minValue: "Vähimmäisarvo on {value}.",
    sameAs: "Täytyy vastata kenttää {otherName}",
    someFieldsAreIncorrect: "Jotkut kentät on täytetty virheellisesti.",
    url: "Virheellinen linkki.",
    notUrl: "Ei saa olla linkki.",
  },

  account: "Tili",
  logout: "Kirjaudu ulos",
  login: "Kirjaudu sisään",
  email: "Sähköposti",
  search: "Haku",
  password: "Salasana",
  confirmPassword: "Vahvista salasana",
  signupInstead: "Luo tili",
  signupFailed: "Rekisteröinti epäonnistui",
  signupSuccessfull: "Rekisteröinti onnistui",
  signupSuccessfullDescription:
    "Siirry sähköpostissa lähetettyyn linkkiin vahvistaaksesi tilisi.",
  loginInstead: "Kirjaudu sisään",
  loginFailed: "Kirjautuminen epäonnistui",
  signup: "Luo tili",
  forgetPassword: "Unohtuiko salasana?",
  loginDescription: "Kirjaudu sisään päästäksesi omaan sivuusi.",
  creatorLogin: "Sisäänkirjautuminen sisällöntuottajille",
  searchCreators: {
    title: "Etsi sisällöntuottajia",
    description: "Etsi sisällöntuottajia, joilla on julkinen sivu xmrchatissa.",
  },
  contactUs: "Ota yhteyttä",

  xmrchat: "XMRChat",
  heroDescription: "Tue suosikkistriimaajaasi Monerolla.",
  findCreators: "Etsi sisällöntuottajia",
  creatorsStartHere: "Sisällöntuottajille: Aloita tästä",

  FAQ: {
    title: "Usein kysytyt kysymykset",
    whyTipWithXMRChat: "Miksi käyttää XMRChatia tippaukseen?",
    whyUseMonero: "Miksi XMRChat käyttää Moneroa?",
    whereToGetMonero: "Mistä saan Moneroa?",
  },

  earnMore: {
    title: "Ansaitse enemmän",
    description:
      "YouTube vie 30–50 % Superchatista. Rumble ottaa 20 % Rantsista. XMRChatilla saat 100 % tipeistä suoraan Monero-lompakkoosi.",
  },
  censorshipResistant: {
    title: "Sensuurinkestävä",
    description:
      "Monerolla saat tulot ilman teknologiajättien sääntöjä tai rajoituksia.",
  },
  corruptionResistant: {
    title: "Korruptiota kestävä",
    description:
      "Monet hallinnot jäädyttävät tilejä. Monero antaa sinun olla oma pankkisi ja hallita talouttasi.",
  },
  private: {
    title: "Yksityinen",
    description:
      "Katsojat voivat tipata anonyymisti – ilman pelkoa tunnistamisesta.",
  },
  quickAndEasy: {
    title: "Nopea ja helppo",
    description:
      "Ei tiliä, ei sähköpostivahvistuksia, ei korttitietoja. Fani syöttää nimen, viestin, summan ja lähettää XMR:n.",
  },
  openSource: {
    title: "Avoin lähdekoodi",
    description:
      "XMRChat on avointa lähdekoodia. Katso koodi osoitteessa {github}.",
  },

  lowFees: {
    title: "Alhaiset maksut",
    description: "Moneron siirtomaksut ovat vain muutamia senttejä.",
  },
  privateMonero: {
    title: "Yksityisyys",
    description:
      "Toisin kuin useimmat kryptot, Monero piilottaa tapahtumatiedot. Lähettäjää, vastaanottajaa eikä summaa näy lohkoketjussa.",
  },
  accepted: {
    title: "Hyväksytty",
    description:
      "Sinun ei tarvitse myydä Moneroa vaihtopalvelussa. Voit ostaa Monerolla myös suoraan {xmrbazaar}:sta ja {monerica}:sta.",
  },
  andMore: {
    title: "Ja paljon muuta",
    description: "Lue lisää Monerosta osoitteessa {getmonero}.",
  },

  whereToGetMonero: {
    cakeWallet: "Osta tai vaihda Moneroa {cakeWallet}:ssa.",
    stealthex:
      "Voit vaihtaa muut kryptosi Moneroon (XMR) sivustoilla kuten {stealthex} ja {kycnot}.",
    haveno:
      "Osta Moneroa ilman KYC:tä {haveno}:sta. Katso käteismaksuohje osoitteessa {blog}.",
    kraken: "Osta Moneroa KYC:llä {kraken}:sta.",
    xmrbazaar:
      "Myy tavaroita tai palveluita Monerolla osoitteessa {xmrbazaar}.",
    gupax: "Louhi Moneroa käyttäen {gupax}:ia.",
    kunoAnneMedia: "Luo Monero-varainkeruu {kunoAnneMedia}:ssa.",
    monerica:
      "Hyväksy Monero liiketoiminnassasi ja listaa itsesi {monerica}, {monerodirectory} ja {xmrbazaar} sivuille.",
  },

  tipName: "Nimi",
  tipAmount: "Summa",
  tipMessage: "Viesti",
  tipPrivate: "Yksityinen",
  tipDate: "Päivämäärä",
  tipUpdated: "Vinkki päivitetty!",
  tipPrivateTooltip: "Nimi ja viesti näkyvät vain striimaajalle.",
  tipCoin: "Kryptovaluutta",
  tipCoinPlaceholder: "XMR",
  sendTip: "Lähetä tippi",
  tipCreationFailed: "Tipin luonti epäonnistui",
  tipNamePlaceholder: "Anna nimesi",
  tipAmountPlaceholder: "Anna summa",
  tipMessagePlaceholder: "Kirjoita viesti",
  tipPrivatePlaceholder: "Yksityinen",
  tipSwapUnavailable: "Vaihdetta ei ole tällä hetkellä saatavilla.",
  tipSwapMinimum: "Vähintään {minSwapUSD}$ vaihdettavaksi",
  minUsdAmount: "Vähintään {minUsdAmount}",
  recentTips: "Viimeisimmät tipit",
  tipDisplayValueTooltip: "Näytä tippi XMR tai USD muotoisena",
  noRecentTips: "Ei uusia tippejä!",
  pageDeactivatedAlert:
    "Sivusi on poistettu käytöstä eikä se ole julkisesti näkyvissä. Ota yhteyttä tukeen saadaksesi lisätietoja.",

  tipWalletWarningTitle: "Älä lähetä tippejä striimaajan lompakosta.",
  tipWalletWarningDescription:
    "Älä käytä rekisteröityä striimaajan lompakkoa – vaihtorahat voivat vääristää näkyvää summaa.",
  tipWalletMinimum:
    "Lähetä vähintään {minimumAmount} XMR seuraavaan osoitteeseen, jotta tippisi näkyy xmrchatissa.",
  openInMyWallet: "Avaa lompakossani",
  cancel: "Peruuta",
  copyAddress: "Kopioi osoite",
  waitingForPayment: "Odotetaan maksua",

  contactUsDescription: "Ota meihin yhteyttä kysymyksillä tai palautteella.",
  contactUsForm: "Yhteydenottolomake",
  contactUsFormDescription:
    "Ota meihin yhteyttä kysymyksillä tai palautteella.",
  contactUsFormButton: "Lähetä viesti",
  emailUsDirectly: "Lähetä meille suoraan sähköpostia",
  followUsOnTwitter: "Seuraa meitä Twitterissä",
  twitter: "Twitter",

  // CREATE PAGE
  createPage: "Luo sivu",
  getStartedCreatingPage: "Aloita luomalla striimaajasivu",
  home: "Etusivu",
  logo: "Logo",
  logoRatio: "1:1 suhde",
  bannerImage: "Bannerikuva",
  bannerImageBestRatio: "Paras koko on 3:1",
  yourId: "Sinun ID",
  pageSlug: "Sivun osoite (slug)",
  moneroPrmReciveAddress: "Monero ensisijainen vastaanotto-osoite",
  prmMoneroReciveAdressBegin:
    "Ensisijaiset Monero-osoitteet alkavat numerolla 4.",
  moneroSecretViewKey: "Monero salainen katseluavain",
  weNeedSecretViewKey:
    "Tarvitsemme salaisen katseluavaimen, jotta voimme nähdä katsojien maksut. {whereToFind}",
  whereToFindViewKey: "Mistä löydän katseluavaimen?",
  twitchChannelName: "Twitch-kanavan nimi",
  nameOfYourTwitchChannel:
    "Twitch-kanavasi nimi. Käytetään tippien näyttämiseen streamissä xmr_chat Twitch-botin kautta.",
  optional: "Valinnainen",
  minTipAmount: "Minimi tippi (XMR)",
  defaultTipAmount: "Oletustippimäärä",
  thisIsOnlyForDisplaying:
    "Tämä on vain esitystarkoituksiin. Katsojat voivat muuttaa tätä itse tippejä antaessaan.",
  publicPage: "Julkinen sivu (näkyy tekijähakusivulla).",
  continue: "Jatka",
  clickToUpload: "Klikkaa ladataksesi",
  pageCreatedSuccessfully: "Sivu luotiin onnistuneesti!",
  slugReservedUntil: "Slug on varattu asti ",
  note: "Huom",
};
