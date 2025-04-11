export default {
  validations: {
    required: "Поле обязательно для заполнения",
    email: "Неверный адрес электронной почты",
    numberic: "Должно быть числом",
    minLength: "Минимум {length} символов.",
    maxLength: "Не должно превышать {length} символов.",
    minValue: "Минимальное значение {value}.",
    sameAs: "Должно совпадать с {otherName}",
    someFieldsAreIncorrect: "Некоторые поля заполнены неверно.",
    url: "Недопустимая ссылка.",
    notUrl: "Не должно быть ссылкой.",
  },

  account: "Аккаунт",
  logout: "Выйти",
  login: "Войти",
  email: "Эл. почта",
  search: "Поиск",
  password: "Пароль",
  confirmPassword: "Подтвердите пароль",
  signupInstead: "Зарегистрироваться",
  signupFailed: "Ошибка регистрации",
  signupSuccessfull: "Регистрация прошла успешно",
  signupSuccessfullDescription:
    "Пожалуйста, перейдите по ссылке, отправленной на вашу электронную почту, чтобы подтвердить аккаунт.",
  loginInstead: "Войти",
  loginFailed: "Ошибка входа",
  signup: "Регистрация",
  forgetPassword: "Забыли пароль?",
  loginDescription:
    "Войдите в аккаунт, чтобы получить доступ к вашей странице.",
  creatorLogin: "Вход для авторов",
  searchCreators: {
    title: "Поиск авторов",
    description: "Найдите авторов с публичными страницами на xmrchat.",
  },
  contactUs: "Связаться с нами",

  xmrchat: "XMRChat",
  heroDescription: "Поддержите любимого стримера криптовалютой.",
  findCreators: "Найти авторов",
  creatorsStartHere: "Начало для авторов",

  FAQ: {
    title: "Часто задаваемые вопросы",
    whyTipWithXMRChat: "Почему стоит использовать XMRChat?",
    whyUseMonero: "Почему XMRChat использует Monero?",
    whereToGetMonero: "Где купить Monero?",
  },

  earnMore: {
    title: "Зарабатывайте больше",
    description:
      "YouTube удерживает 30–50% с Superchats. Rumble — 20% с Rants. С XMRChat вы получаете 100% чаевых от фанатов прямо в свой Monero-кошелек.",
  },
  censorshipResistant: {
    title: "Устойчивость к цензуре",
    description:
      "Принимая чаевые в Monero, вы получаете доход, не связанный с большими технокомпаниями и их политиками.",
  },
  corruptionResistant: {
    title: "Устойчивость к коррупции",
    description:
      "Многие режимы конфискуют или блокируют счета оппозиции. Monero позволяет вам быть собственным банком и контролировать свои финансы.",
  },
  private: {
    title: "Конфиденциальность",
    description:
      "Зрители могут отправлять чаевые анонимно — без страха, что кто-то узнает о донатах.",
  },
  quickAndEasy: {
    title: "Быстро и просто",
    description:
      "Не нужно создавать аккаунт, подтверждать email или вводить данные карты. Поклонник просто указывает имя, сообщение, сумму и отправляет XMR.",
  },
  openSource: {
    title: "Открытый код",
    description:
      "XMRChat — это open source. Исходный код доступен на {github}.",
  },

  lowFees: {
    title: "Низкие комиссии",
    description: "Комиссии в сети Monero составляют считанные центы.",
  },
  privateMonero: {
    title: "Приватность",
    description:
      "В отличие от большинства криптовалют, Monero скрывает данные транзакций. Отправитель, получатель и сумма не видны в блокчейне.",
  },
  accepted: {
    title: "Принимается",
    description:
      "Не нужно продавать крипту через централизованные биржи. Покупайте товары и услуги напрямую у продавцов на {xmrbazaar} и {monerica}.",
  },
  andMore: {
    title: "И многое другое",
    description: "Узнайте больше о Monero на {getmonero}.",
  },

  whereToGetMonero: {
    cakeWallet: "Купите или обменяйте крипту на Monero в {cakeWallet}.",
    stealthex:
      "Обменяйте криптовалюту на Monero (XMR) на {stealthex} и других платформах с {kycnot}.",
    haveno:
      "Купите Monero без KYC на {haveno}. Инструкция по оплате наличными — на {blog}.",
    kraken: "Купите Monero с KYC на {kraken}.",
    xmrbazaar: "Продавайте товары или услуги за Monero на {xmrbazaar}.",
    gupax: "Добывайте его с помощью {gupax}.",
    kunoAnneMedia: "Создайте сбор средств в Monero на {kunoAnneMedia}.",
    monerica:
      "Принимайте Monero в своём бизнесе и появляйтесь в каталогах {monerica}, {monerodirectory} и на карте на {xmrbazaar}.",
  },

  tipName: "Имя",
  tipAmount: "Сумма",
  tipMessage: "Сообщение",
  tipPrivate: "Приватно",
  tipPrivateTooltip: "Имя и сообщение будут видны только стримеру.",
  tipCoin: "Монета",
  tipCoinPlaceholder: "XMR",
  sendTip: "Отправить чаевые",
  tipCreationFailed: "Не удалось создать чаевые",
  tipNamePlaceholder: "Введите имя",
  tipAmountPlaceholder: "Введите сумму",
  tipMessagePlaceholder: "Введите сообщение",
  tipPrivatePlaceholder: "Приватно",
  tipSwapUnavailable: "Обмен сейчас недоступен.",
  tipSwapMinimum: "Минимум {minSwapUSD}$ для обмена",
  minUsdAmount: "Минимум {minUsdAmount}",
  recentTips: "Последние чаевые",
  tipDisplayValueTooltip: "Показывать чаевые в XMR или USD",
  noRecentTips: "Нет недавних чаевых!",

  tipWalletWarningTitle: "Не отправляйте чаевые с кошелька стримера.",
  tipWalletWarningDescription:
    "Пожалуйста, не используйте зарегистрированный кошелек стримера — сдача может исказить отображаемую сумму.",
  tipWalletMinimum:
    "Пожалуйста, отправьте минимум {minimumAmount} XMR на следующий адрес, чтобы ваш донат отобразился на xmrchat.",
  openInMyWallet: "Открыть в моем кошельке",
  cancel: "Отмена",
  copyAddress: "Скопировать адрес",
  waitingForPayment: "Ожидание платежа",

  contactUsDescription: "Свяжитесь с нами по вопросам и отзывам.",
  contactUsForm: "Форма связи",
  contactUsFormDescription: "Свяжитесь с нами по вопросам и отзывам.",
  contactUsFormButton: "Связаться с нами",
  emailUsDirectly: "Напишите нам напрямую",
  followUsOnTwitter: "Подписывайтесь на нас в Twitter",
  twitter: "Twitter",
};
