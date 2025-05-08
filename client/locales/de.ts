export default {
  validations: {
    required: "Pflichtfeld",
    email: "E-Mail ist ungültig",
    numberic: "Muss eine Zahl sein",
    minLength: "Muss mindestens {length} Zeichen lang sein",
    maxLength: "Darf nicht länger als {length} Zeichen sein",
    minValue: "Muss mindestens {value} sein",
    sameAs: "Muss identisch mit {otherName} sein",
    someFieldsAreIncorrect: "Einige Felder sind nicht korrekt ausgefüllt",
    url: "Der Link ist ungültig",
    notUrl: "Darf kein Link sein",
  },

  account: "Konto",
  logout: "Abmelden",
  login: "Anmelden",
  send: "Senden",
  loginFailed: "Anmeldung fehlgeschlagen",
  email: "E-Mail",
  search: "Suchen",
  password: "Passwort",
  confirmPassword: "Passwort bestätigen",
  signupInstead: "Stattdessen registrieren",
  loginInstead: "Stattdessen anmelden",
  signup: "Registrieren",
  signupFailed: "Registrierung fehlgeschlagen",
  signupSuccessfull: "Registrierung erfolgreich",
  noItems: "Keine Einträge",
  signupSuccessfullDescription:
    "Bitte folgen Sie dem Link in Ihrer E-Mail, um Ihr Konto zu verifizieren.",
  forgetPassword: "Passwort vergessen?",
  loginDescription:
    "Melden Sie sich bei Ihrem Konto an, um auf Ihre Anzeigeseite zuzugreifen",
  resetPassword: "Passwort zurücksetzen",
  enterYourNewPassword: "Geben Sie Ihr neues Passwort ein",
  passwordResetFailed: "Passwort zurücksetzen fehlgeschlagen",
  passwordUpdated: "Ihr Passwort wurde erfolgreich aktualisiert.",
  weSentYouAnEmail:
    "Wir haben Ihnen eine E-Mail {email} gesendet, bitte folgen Sie dem Link in der E-Mail, um Ihr Passwort zurückzusetzen.",
  changeEmail: "E-Mail ändern",
  enterEmailToResetPassword:
    "Geben Sie Ihre E-Mail ein, um Ihr Passwort zurücksetzen",
  creatorLogin: "Ersteller Anmeldung",
  searchCreators: {
    title: "Ersteller Suchen",
    description:
      "Suchen Sie nach Erstellern mit öffentlichen Seiten auf xmrchat.",
  },
  typePageName: "Seitennamen eingeben...",
  contactUs: "Kontaktieren Sie uns",
  here: "hier",

  xmrchat: "XMRChat",
  heroDescription: "Unterstütze deinen Lieblings-Streamer mit Kryptowährung",
  findCreators: "Creator finden",
  creatorsStartHere: "Creator starten hier",

  FAQ: {
    title: "FAQ",
    whyTipWithXMRChat: "Warum mit XMRChat tippen?",
    whyUseMonero: "Warum verwendet XMRChat Monero?",
    whereToGetMonero: "Wo bekomme ich Monero?",
  },

  earnMore: {
    title: "Mehr verdienen",
    description:
      "YouTube berechnet 30-50% für Superchats, Rumble 20% für Rants. Mit XMRChat erhältst du 100% deiner XMR-Trinkgelder von Fans direkt in deine Monero-Wallet",
  },
  censorshipResistant: {
    title: "Zensurresistent",
    description:
      "Das Akzeptieren von Monero-Trinkgeldern ermöglicht dir ein Einkommen, das nicht direkt mit Big Tech und willkürlichen Richtlinienverstößen verbunden ist",
  },
  corruptionResistant: {
    title: "Korruptionsresistent",
    description:
      "Viele Regime beschlagnahmen oder sperren Bankkonten politischer Gegner. Monero ermöglicht es dir, deine eigene Bank zu sein mit vollständiger Kontrolle über deine Finanzen",
  },
  private: {
    title: "Privat",
    description:
      "Zuschauer können anonym Trinkgeld geben, keine Sorgen vor Arbeitgebern oder anderen, die deine Spenden kennen",
  },
  quickAndEasy: {
    title: "Schnell und einfach",
    description:
      "Zuschauer müssen kein Konto erstellen, keine E-Mail verifizieren oder Kreditkarteninformationen eingeben. Fans gehen zu deiner Trinkgeld-Seite, geben ihren Namen, Nachricht und Betrag ein und senden ihr XMR-Trinkgeld",
  },
  openSource: {
    title: "Open Source",
    description:
      "XMRChat ist Open Source. Du kannst den Code auf {github} überprüfen.",
  },

  lowFees: {
    title: "Niedrige Gebühren",
    description: "Monero-Transaktionsgebühren betragen höchstens ein paar Cent",
  },
  privateMonero: {
    title: "Privat",
    description:
      "Während die meisten Kryptowährungen offene Hauptbücher verwenden, verbirgt Monero Transaktionsdaten. Sender, Empfänger und Transaktionsbeträge werden beim Blick auf die Blockchain nicht offengelegt",
  },
  accepted: {
    title: "Akzeptiert",
    description:
      "Vermeide den Aufwand, deine Kryptowährung an einer zentralisierten Börse zu verkaufen. Kaufe Waren und Dienstleistungen direkt von Händlern, die Monero akzeptieren auf {xmrbazaar} und {monerica}.",
  },
  andMore: {
    title: "Und mehr",
    description: "Erfahre mehr über Monero auf {getmonero}.",
  },

  whereToGetMonero: {
    cakeWallet:
      "Kaufen oder tauschen Sie andere Kryptowährungen gegen Monero bei {cakeWallet}.",
    stealthex:
      "Tauschen Sie andere Kryptowährungen gegen Monero (XMR) bei {stealthex} und anderen bei {kycnot}.",
    haveno:
      "Kaufen Sie Monero ohne KYC bei {haveno}. Tutorial für Bargeld per Post bei {blog}.",
    thisBlogPost: "Dieser Blogbeitrag",
    kraken: "Kaufen Sie Monero mit KYC bei {kraken}.",
    xmrbazaar:
      "Verkaufen Sie Artikel oder Dienstleistungen für Monero bei {xmrbazaar}.",
    gupax: "Minen Sie es mit {gupax}.",
    kunoAnneMedia:
      "Erstellen Sie eine Monero-Spendenaktion bei {kunoAnneMedia}.",
    monerica:
      "Akzeptieren Sie Monero in Ihrem Unternehmen und werden Sie auf den Seiten {monerica} und {monerodirectory} sowie auf der Geschäftsübersichtskarte bei {xmrbazaar} gelistet.",
  },

  // TIP PAGE
  tipName: "Name",
  tipAmount: "Betrag",
  tipMessage: "Nachricht",
  tipPrivate: "Privat",
  tipDate: "Datum",
  tipUpdated: "Tipp aktualisiert!",
  tipPrivateTooltip: "Name und Nachricht sind nur für den Streamer sichtbar",
  tipCoin: "Coin",
  tipCoinPlaceholder: "XMR",
  sendTip: "Trinkgeld senden",
  tipCreationFailed: "Trinkgeld-Erstellung fehlgeschlagen",
  tipNamePlaceholder: "Name eingeben",
  tipAmountPlaceholder: "Betrag eingeben",
  tipMessagePlaceholder: "Nachricht eingeben",
  tipPrivatePlaceholder: "Privat",
  tipSwapUnavailable: "Tausch ist derzeit nicht verfügbar",
  tipSwapMinimum: "Minimum {minSwapUSD}$ zum Tauschen",
  minUsdAmount: "Minimum {minUsdAmount}",
  recentTips: "Letzte Trinkgelder",
  tipDisplayValueTooltip: "Trinkgeldwerte in XMR oder USD anzeigen",
  noRecentTips: "Keine aktuellen Trinkgelder!",
  pageDeactivatedAlert:
    "Ihre Seite wurde deaktiviert und ist nicht öffentlich sichtbar. Bitte kontaktieren Sie den Support für weitere Informationen.",

  tipWalletWarningTitle: "Nicht mit Streamer-Wallet Trinkgeld geben",
  tipWalletWarningDescription:
    "Bitte vermeiden Sie es, Trinkgelder mit der auf der Seite registrierten Wallet zu senden. Die zurückgegebene Änderung erhöht den Betrag, den wir als empfangen sehen",
  tipWalletMinimum:
    "Bitte senden Sie mindestens {minimumAmount} XMR an die folgende Adresse, damit Ihr xmrchat angezeigt wird",
  openInMyWallet: "In meiner Wallet öffnen",
  cancel: "Abbrechen",
  copyAddress: "Adresse kopieren",
  waitingForPayment: "Warte auf Zahlung",

  // CONTACT US PAGE
  contactUsDescription: "Kontaktieren Sie uns bei Fragen oder Feedback.",
  contactUsForm: "Kontaktformular",
  contactUsFormDescription: "Kontaktieren Sie uns bei Fragen oder Feedback.",
  contactUsFormButton: "Kontakt",
  emailUsDirectly: "Direkt per E-Mail kontaktieren",
  followUsOnTwitter: "Folgen Sie uns auf Twitter",
  twitter: "Twitter",

  // CREATE PAGE
  createPage: "Seite erstellen",
  getStartedCreatingPage:
    "Beginnen Sie mit der Erstellung Ihrer Streamer-Seite",
  home: "Startseite",
  logo: "Logo",
  logoRatio: "1:1 Verhältnis",
  bannerImage: "Bannerbild",
  bannerImageBestRatio: "Am besten im Verhältnis 3:1 hochladen",
  yourId: "Ihre ID",
  pageSlug: "Seiten-Slug",
  moneroPrmReciveAddress: "Primäre Monero-Empfangsadresse",
  prmMoneroReciveAdressBegin:
    "Primäre Monero-Adressen beginnen mit der Zahl 4.",
  moneroSecretViewKey: "Geheimer View Key von Monero",
  weNeedSecretViewKey:
    "Wir benötigen den geheimen View Key, um eingehende Transaktionen von Zuschauern sehen zu können. {whereToFind}",
  whereToFindViewKey: "Wo finde ich den View Key?",
  twitchChannelName: "Twitch-Kanalname",
  nameOfYourTwitchChannel:
    "Name Ihres Twitch-Kanals. Wird verwendet, um Tipps über den xmr_chat Twitch-Bot anzuzeigen.",
  optional: "Optional",
  minTipAmount: "Min. Tippbetrag (XMR)",
  defaultTipAmount: "Standard-Tippbetrag",
  thisIsOnlyForDisplaying:
    "Dies dient nur zur Anzeige des Tippbetrags. Zuschauer können dies auf der Tippseite selbst ändern.",
  publicPage: "Öffentliche Seite (wird auf der Ersteller-Suchseite angezeigt).",
  continue: "Weiter",
  clickToUpload: "Zum Hochladen klicken",
  pageCreatedSuccessfully: "Seite wurde erfolgreich erstellt!",
  slugReservedUntil: "Ihr Slug ist reserviert bis ",
  note: "Hinweis",

  // STREAMER MENU
  myXmrchats: "Meine xmrchats",
  editTipPage: "Trinkgeld-Seite bearbeiten",
  tipPage: "Trinkgeld-Seite",
  contentLinks: "Content-Links",
  obs: "OBS",

  // ACCOUNT PAGE
  changePassword: "Passwort ändern",
  updateYourLoginPassword: "Aktualisieren Sie Ihr Anmeldepasswort",
  currentPassword: "Aktuelles Passwort",
  newPassword: "Neues Passwort",
  repeatNewPassword: "Neues Passwort wiederholen",
  contactSupportForEmailChange:
    "Kontaktieren Sie den Support, um Ihre E-Mail-Adresse zu ändern.",

  // EDIT PAGE
  editPage: "Seite bearbeiten",
  customizeYourTipPage: "Passen Sie Ihre Trinkgeld-Seite an.",
  errorCreatingUpdatingPage: "Fehler beim Erstellen/Aktualisieren der Seite",
  tipAmountSuggestions: "Trinkgeldbetrag-Vorschläge",
  pageWillBeAvailableAt: "Ihre Seite wird unter {url} verfügbar sein",
  noSuggestedAmountsAdded:
    "Es wurden keine Beträge vorgeschlagen. Klicken Sie auf die Schaltfläche unten, um neue Stufen hinzuzufügen.",
  addTier: "Stufe hinzufügen",
  remove: "Entfernen",
  name: "Name",
  amountUSD: "Betrag (USD)",

  // CONTENT LINKS
  brandName: "Markenname",
  brandNameHelp: "Name der Marke/des Inhalts. Kann vom Slug abweichen.",
  searchTerms: "Suchbegriffe",
  searchTermsHelp:
    "Die Creator-Suche liefert Ergebnisse basierend auf dem Seiten-Slug, Namen und Schlüsselwörtern in dieser Liste.",
  contentLinksDescription: "Name, Suchbegriffe und Content-Links",
  contentLinksSecondDescription:
    "Links zu Ihren Social-Media-Seiten oder Websites. Um einen Wert zurückzusetzen, lassen Sie das Feld leer.",
  saveChanges: "Änderungen speichern",
  notUrlWithMessage:
    "Geben Sie nur den Namen ein, nicht den vollständigen Link.",
  changesAreSaved: "Änderungen wurden gespeichert.",
  errorSavingChanges: "Fehler beim Speichern der Änderungen.",

  // OBS
  obsDescription: "OBS-Widget und Einstellungen.",
  settingsAreUpdated: "Einstellungen wurden aktualisiert.",
  errorUpdatingSettings: "Fehler beim Aktualisieren der Einstellungen",
  toUseXMRchatsOnOBS:
    "Um XMRChat in OBS zu verwenden, kopieren Sie den Link zur OBS-Seite und fügen Sie ihn in 'Browser' der OBS-Quellen ein.",
  copyOBSLink: "OBS-Seitenlink kopieren",
  obsPageSettings: "OBS-Seiteneinstellungen",
  preventMessagesFromFading: "Verhindern, dass Nachrichten verblassen",
  preventMessagesFromFadingDescription:
    "Wenn aktiv, bleiben die letzten Tipps auf dem Bildschirm, ansonsten wird jede Nachricht 60 Sekunden lang angezeigt.",
  playSound: "Ton abspielen",
  playSoundDescription:
    "Spielt einen Ton auf der OBS-Seite ab, wenn ein neuer Tipp erscheint.",
  playSoundDescriptionLocal:
    "Wenn Sie diese Funktion lokal in Ihrem Browser testen, klicken Sie nach dem Öffnen des obs-Tabs irgendwo auf die Seite. Andernfalls spielt der Browser keinen Ton ab, da keine Interaktionen mit dem geöffneten Tab stattgefunden haben.",
  autoShowTips: "Automatisch Tipps anzeigen",
  autoShowTipsDescription:
    "Wenn aktiviert, werden Tipps automatisch auf der OBS-Seite für 60 Sekunden angezeigt.",
};
