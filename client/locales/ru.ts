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
    streamerSlug:
      "Путь может содержать только строчные буквы, цифры, подчеркивание и дефисы.",
    moneroPrimaryAddress:
      "Основной адрес недействителен. Он должен начинаться с цифры 4.",
  },

  account: "Аккаунт",
  logout: "Выйти",
  login: "Войти",
  send: "Отправить",
  email: "Эл. почта",
  search: "Поиск",
  password: "Пароль",
  confirmPassword: "Подтвердите пароль",
  signupInstead: "Зарегистрироваться",
  signupFailed: "Ошибка регистрации",
  signupSuccessfull: "Регистрация прошла успешно",
  noItems: "Нет элементов",
  signupSuccessfullDescription:
    "Пожалуйста, перейдите по ссылке, отправленной на вашу электронную почту, чтобы подтвердить аккаунт.",
  loginInstead: "Войти",
  loginFailed: "Ошибка входа",
  signup: "Регистрация",
  forgetPassword: "Забыли пароль?",
  loginDescription:
    "Войдите в аккаунт, чтобы получить доступ к вашей странице.",
  resetPassword: "Сбросить пароль",
  enterYourNewPassword: "Введите новый пароль",
  passwordResetFailed: "Ошибка сброса пароля",
  passwordUpdated: "Ваш пароль был успешно обновлен.",
  weSentYouAnEmail:
    "Мы отправили вам электронное письмо {email}, пожалуйста, следуйте ссылке в письме, чтобы сбросить пароль.",
  changeEmail: "Изменить электронную почту",
  enterEmailToResetPassword:
    "Введите вашу электронную почту для сброса пароля.",
  creatorLogin: "Вход для авторов",
  searchCreators: {
    title: "Поиск Создателей",
    description: "Ищите создателей с публичными страницами на xmrchat.",
  },
  typePageName: "Введите название страницы...",
  contactUs: "Свяжитесь с нами",
  here: "здесь",

  xmrchat: "XMRChat",
  heroDescription: "Поддержите любимого стримера криптовалютой.",
  findCreators: "Найти авторов",
  creatorsStartHere: "Начало для авторов",

  FAQ: {
    title: "Часто задаваемые вопросы",
    whyTipWithXMRChat: "Почему стоит использовать XMRChat?",
    howToUseXMRChat: "How to use XMRChat?",
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
  forContentCreators: {
    title: "For Content Creators",
    description: {
      main: "Click Creators Start Here button. Create xmrchat account. Create Tip Page. Let your audience know the URL of your tip page.",
      ifUseStreamyard:
        "— If you use Streamyard - displayed xmrchat bot logo looks best with 'Minimal' setting ",
      ifUseOBS: "— If you use OBS...",
      ifOnlyYouTube: "— If you only live stream to YouTube.",
    },
  },
  forFans: {
    title: "For Fans",
    description:
      "go to the URL of your content creator's tip page. Type username and message, choose tip amount, then send.",
  },
  whereToGetMonero: {
    cakeWallet: "Купите или обменяйте крипту на Monero в {cakeWallet}.",
    stealthex:
      "Обменяйте криптовалюту на Monero (XMR) на {stealthex} и других платформах с {kycnot}.",
    haveno:
      "Купите Monero без KYC на {haveno}. Инструкция по оплате наличными — на {blog}.",
    thisBlogPost: "Эта запись в блоге",
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
  tipDate: "Дата",
  tipUpdated: "Совет обновлён!",
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
  tipSwapMinimum: "Минимум {min} для обмена",
  tipMinimum: "Минимум {min}",
  recentTips: "Последние чаевые",
  tipDisplayValueTooltip: "Показывать чаевые в XMR или {fiat}",
  noRecentTips: "Нет недавних чаевых!",
  pageDeactivatedAlert:
    "Ваша страница была деактивирована и не отображается для публичного просмотра. Пожалуйста, свяжитесь с поддержкой для получения дополнительной информации.",

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

  // CREATE PAGE
  createPage: "Создать страницу",
  getStartedCreatingPage: "Начните с создания страницы стримера",
  home: "Главная",
  logo: "Логотип",
  logoRatio: "Соотношение 1:1",
  bannerImage: "Баннер",
  bannerImageBestRatio: "Лучшее соотношение — 3:1",
  yourId: "Ваш ID",
  pageSlug: "Slug страницы",
  moneroPrmReciveAddress: "Основной адрес для получения Monero",
  prmMoneroReciveAdressBegin: "Основные адреса Monero начинаются с цифры 4.",
  moneroSecretViewKey: "Секретный ключ просмотра Monero",
  weNeedSecretViewKey:
    "Нам нужен секретный ключ просмотра, чтобы видеть входящие транзакции от зрителей. {whereToFind}",
  whereToFindViewKey: "Где найти ключ просмотра?",
  twitchChannelName: "Имя Twitch-канала",
  nameOfYourTwitchChannel:
    "Имя вашего Twitch-канала. Используется для отображения чаевых через xmr_chat Twitch-бота.",
  optional: "Необязательно",
  minTipAmount: "Мин. сумма чаевых (XMR)",
  defaultTipAmount: "Значение чаевых по умолчанию",
  thisIsOnlyForDisplaying:
    "Это только для отображения значений чаевых. Зрители могут изменить их на странице чаевых.",
  publicPage: "Публичная страница (отображается в поиске создателей).",
  continue: "Продолжить",
  clickToUpload: "Кликните, чтобы загрузить",
  pageCreatedSuccessfully: "Страница успешно создана!",
  slugReservedUntil: "Ваш slug зарезервирован до ",
  note: "Примечание",
  pageUpdated: "Страница обновлена!",
  loading: "Загрузка",
  available: "Доступно",
  unavailable: "Недоступно",
  fiatUnit: "Валюта",
  fiatUnitHelp:
    "Валюта, используемая для отображения чаевых при установленном режиме отображения чаевых в валюте.",

  // STREAMER MENU
  menu: "Меню",
  myXmrchats: "Мои xmrchats",
  editTipPage: "Редактировать Страницу Чаевых",
  tipPage: "Страница Чаевых",
  contentLinks: "Ссылки на Контент",
  obs: "OBS",
  show: "Показать",
  hide: "Скрыть",
  youDontHavePage: "У вас еще нет страницы",
  getStartedByCreatingPage: "Начните с создания страницы для себя",
  createNewPage: "Создать новую страницу",

  // ACCOUNT PAGE
  changePassword: "Изменить Пароль",
  updateYourLoginPassword: "Обновить пароль для входа",
  currentPassword: "Текущий пароль",
  newPassword: "Новый пароль",
  repeatNewPassword: "Повторите новый пароль",
  contactSupportForEmailChange:
    "Свяжитесь с поддержкой для изменения вашего адреса электронной почты.",

  // EDIT PAGE
  editPage: "Редактировать Страницу",
  customizeYourTipPage: "Настройте свою страницу чаевых.",
  errorCreatingUpdatingPage: "Ошибка при создании/обновлении страницы",
  tipAmountSuggestions: "Предлагаемые Суммы Чаевых",
  pageWillBeAvailableAt: "Ваша страница будет доступна по адресу {url}",
  noSuggestedAmountsAdded:
    "Нет предложенных сумм, нажмите кнопку ниже, чтобы добавить новые уровни.",
  addTier: "Добавить Уровень",
  remove: "Удалить",
  name: "Имя",
  amountUSD: "Сумма (USD)",
  amountFiat: "Сумма ( {fiat} )",

  // CONTENT LINKS
  brandName: "Название Бренда",
  brandNameHelp: "Название бренда/контента. Может отличаться от slug.",
  searchTerms: "Поисковые Термины",
  searchTermsHelp:
    "Поиск создателей будет возвращать результаты на основе slug страницы, имени и ключевых слов в этом списке.",
  contentLinksDescription: "Имя, Поисковые Термины и Ссылки на Контент",
  contentLinksSecondDescription:
    "Ссылки на ваши страницы в соцсетях или веб-сайты. Чтобы сбросить значение, оставьте поле пустым.",
  saveChanges: "Сохранить Изменения",
  notUrlWithMessage: "Введите только название, не полную ссылку.",
  changesAreSaved: "Изменения сохранены.",
  errorSavingChanges: "Ошибка при сохранении изменений.",
  xUsername: "{platform} имя пользователя",
  websiteLink: "Ссылка на сайт",
  youtubeChannel: "Youtube канал",
  podcastRssLink: "Ссылка на RSS-канал",
  nostrPubKey: "Nostr Публичный Ключ",

  // OBS
  obsDescription: "Виджет и настройки OBS.",
  settingsAreUpdated: "Настройки обновлены.",
  errorUpdatingSettings: "Ошибка при обновлении настроек",
  toUseXMRchatsOnOBS:
    "Чтобы использовать XMRChat в OBS, скопируйте ссылку на страницу OBS и добавьте её в 'Браузер' Источников OBS.",
  copyOBSLink: "Копировать Ссылку на Страницу OBS",
  obsPageSettings: "Настройки Страницы OBS",
  preventMessagesFromFading: "Предотвратить исчезновение сообщений",
  preventMessagesFromFadingDescription:
    "Когда активно, последние чаевые остаются на экране, в противном случае каждое сообщение отображается в течение 60 секунд.",
  playSound: "Воспроизвести Звук",
  playSoundDescription:
    "Воспроизводит звук на странице OBS при появлении нового чаевого.",
  playSoundDescriptionLocal:
    "Если вы тестируете эту функцию локально в браузере, после открытия вкладки obs обязательно кликните где-нибудь на странице. В противном случае браузер не будет воспроизводить звук из-за отсутствия взаимодействия с открытой вкладкой.",
  autoShowTips: "Автоматически показывать чаевые",
  autoShowTipsDescription:
    "Если активно, чаевые будут автоматически отображаться на странице OBS в течение 60 секунд.",

  // HEAD
  head: {
    description:
      "Зрители, отправляйте сообщения и чаевые легко и конфиденциально. Стримеры, сохраняйте почти все свои чаевые, а не отдавайте 30–50 % крупным технокомпаниям.",
    title: "Сообщения и чаевые с Monero",
    XMRChatTip: "XMRChat — чаевые для {path} через Monero",
    tip: "Оставить чаевые {path}",
  },
  moneroSuperchats: "Monero Суперчаты : XMRChat",
};
