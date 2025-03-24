export default {
  validations: {
    required: "Champ obligatoire",
    email: "Email invalide",
    numberic: "Doit être un nombre",
    minLength: "Doit contenir au moins {length} caractères.",
    maxLength: "Ne doit pas dépasser {length} caractères.",
    minValue: "Doit être au moins {value}.",
    sameAs: "Doit être identique à {otherName}",
    someFieldsAreIncorrect: "Certains champs ne sont pas correctement remplis.",
    url: "Le lien est invalide.",
    notUrl: "Ne doit pas être un lien.",
  },

  account: "Compte",
  logout: "Déconnexion",
  login: "Connexion",
  loginFailed: "Échec de la connexion",
  email: "Email",
  search: "Rechercher",
  password: "Mot de passe",
  confirmPassword: "Confirmer le mot de passe",
  signupInstead: "S'inscrire à la place",
  loginInstead: "Se connecter à la place",
  signup: "Inscription",
  signupFailed: "Échec de l'inscription",
  signupSuccessfull: "Inscription réussie",
  signupSuccessfullDescription:
    "Veuillez suivre le lien envoyé à votre email pour vérifier votre compte.",
  forgetPassword: "Mot de passe oublié ?",
  loginDescription:
    "Connectez-vous à votre compte pour accéder à votre page d'affichage.",
  creatorLogin: "Connexion Créateur",
  searchCreators: {
    title: "Rechercher des Créateurs",
    description:
      "Recherchez des créateurs avec des pages publiques sur xmrchat.",
  },
  contactUs: "Contactez-nous",

  xmrchat: "XMRChat",
  heroDescription:
    "Offrez des pourboires en cryptomonnaie à vos streamers préférés.",
  findCreators: "Trouver des Créateurs",
  creatorsStartHere: "Les Créateurs commencent ici",

  FAQ: {
    title: "FAQ",
    whyTipWithXMRChat: "Pourquoi donner des pourboires avec XMRChat ?",
    whyUseMonero: "Pourquoi XMRChat utilise-t-il Monero ?",
    whereToGetMonero: "Où obtenir du Monero ?",
  },

  earnMore: {
    title: "Gagnez Plus",
    description:
      "YouTube prélève 30-50% pour les Superchats. Rumble 20% pour les Rants. Avec XMRChat, vous recevez 100% de vos pourboires XMR de vos fans, directement sur votre portefeuille Monero.",
  },
  censorshipResistant: {
    title: "Résistant à la Censure",
    description:
      "Accepter des pourboires en Monero vous permet d'avoir un revenu qui n'est pas directement lié aux grandes entreprises technologiques et aux violations de politiques arbitraires.",
  },
  corruptionResistant: {
    title: "Résistant à la Corruption",
    description:
      "De nombreux régimes saisissent ou gèlent les comptes bancaires des ennemis politiques. Monero vous permet d'être votre propre banque avec un contrôle total de vos finances.",
  },
  private: {
    title: "Privé",
    description:
      "Les spectateurs peuvent donner des pourboires anonymement, sans se soucier que les employeurs ou d'autres personnes connaissent vos dons.",
  },
  quickAndEasy: {
    title: "Rapide et Facile",
    description:
      "Pas besoin pour les spectateurs de créer un compte, de vérifier leur email ou de saisir les informations de leur carte de crédit. Les fans vont sur votre page de pourboire, saisissent leur nom, leur message, le montant et soumettent leur pourboire XMR.",
  },
  openSource: {
    title: "Open Source",
    description:
      "XMRChat est open source. Vous pouvez consulter le code sur {github}.",
  },

  lowFees: {
    title: "Frais réduits",
    description:
      "Les frais de transaction Monero sont de quelques centimes au maximum.",
  },
  privateMonero: {
    title: "Privé",
    description:
      "Alors que la plupart des cryptos utilisent des registres ouverts, Monero cache les données de transaction. L'expéditeur, le destinataire et les montants des transactions ne sont pas révélés en consultant la blockchain.",
  },
  accepted: {
    title: "Accepté",
    description:
      "Évitez les tracas liés à la vente de votre crypto sur un échange centralisé. Achetez des biens et des services directement auprès des marchands qui acceptent Monero sur {xmrbazaar} et {monerica}.",
  },
  andMore: {
    title: "Et plus encore",
    description: "En savoir plus sur Monero sur {getmonero}.",
  },

  // TIP PAGE
  tipName: "Nom",
  tipAmount: "Montant",
  tipMessage: "Message",
  tipPrivate: "Privé",
  tipPrivateTooltip:
    "Le nom et le message ne seront visibles que par le streamer.",
  tipCoin: "Pièce",
  tipCoinPlaceholder: "XMR",
  sendTip: "Envoyer le Pourboire",
  tipCreationFailed: "Échec de la Création du Pourboire",
  tipNamePlaceholder: "Entrez le nom",
  tipAmountPlaceholder: "Entrez le montant",
  tipMessagePlaceholder: "Entrez le message",
  tipPrivatePlaceholder: "Privé",
  tipSwapUnavailable: "L'échange est actuellement indisponible.",
  tipSwapMinimum: "Minimum {minSwapUSD}$ pour échanger",
  minUsdAmount: "Minimum {minUsdAmount}",
  recentTips: "Pourboires Récents",
  tipDisplayValueTooltip: "Afficher les valeurs des pourboires en XMR ou USD",
  noRecentTips: "Aucun pourboire récent !",

  tipWalletWarningTitle:
    "Ne donnez pas de pourboire avec le portefeuille du streamer.",
  tipWalletWarningDescription:
    "Veuillez éviter d'envoyer des pourboires avec le portefeuille enregistré sur la page. Le changement retourné gonfle le montant que nous voyons reçu.",
  tipWalletMinimum:
    "Veuillez envoyer un minimum de {minimumAmount} XMR à l'adresse suivante pour que votre xmrchat soit affiché.",
  openInMyWallet: "Ouvrir dans Mon Portefeuille",
  cancel: "Annuler",
  copyAddress: "Copier l'Adresse",
  waitingForPayment: "En attente du paiement",

  // CONTACT US PAGE
  contactUsDescription: "Contactez-nous pour toute question ou commentaire.",
  contactUsForm: "Formulaire de Contact",
  contactUsFormDescription:
    "Contactez-nous pour toute question ou commentaire.",
  contactUsFormButton: "Contact",
  emailUsDirectly: "Nous écrire directement",
  followUsOnTwitter: "Suivez-nous sur Twitter",
  twitter: "Twitter",

  whereToGetMonero: {
    cakeWallet:
      "Achetez ou échangez d'autres cryptomonnaies contre du Monero sur {cakeWallet}.",
    stealthex:
      "Échangez d'autres cryptomonnaies contre du Monero (XMR) sur {stealthex} et d'autres sur {kycnot}.",
    haveno:
      "Achetez du Monero sans KYC sur {haveno}. Tutoriel pour l'envoi d'argent par courrier sur {blog}.",
    kraken: "Achetez du Monero avec KYC sur {kraken}.",
    xmrbazaar:
      "Vendez des articles ou des services pour du Monero sur {xmrbazaar}.",
    gupax: "Minez-le avec {gupax}.",
    kunoAnneMedia: "Créez une collecte de fonds Monero sur {kunoAnneMedia}.",
    monerica:
      "Acceptez le Monero dans votre entreprise et soyez répertorié sur les pages {monerica} et {monerodirectory} et sur la carte des entreprises sur {xmrbazaar}.",
  },
};
