export default {
  validations: {
    required: "필수 항목입니다.",
    email: "이메일 형식이 올바르지 않습니다.",
    numberic: "숫자여야 합니다.",
    minLength: "{length}자 이상이어야 합니다.",
    maxLength: "{length}자 이하여야 합니다.",
    minValue: "{value} 이상이어야 합니다.",
    sameAs: "{otherName}와(과) 같아야 합니다",
    someFieldsAreIncorrect: "일부 필드가 올바르게 작성되지 않았습니다.",
    url: "유효하지 않은 링크입니다.",
    notUrl: "링크일 수 없습니다.",
  },

  account: "계정",
  logout: "로그아웃",
  login: "로그인",
  send: "보내기",
  email: "이메일",
  search: "검색",
  password: "비밀번호",
  confirmPassword: "비밀번호 확인",
  signupInstead: "대신 회원가입",
  signupFailed: "회원가입 실패",
  signupSuccessfull: "회원가입 성공",
  noItems: "항목이 없습니다",
  signupSuccessfullDescription:
    "이메일로 전송된 링크를 따라가 계정을 인증해 주세요.",
  loginInstead: "대신 로그인",
  loginFailed: "로그인 실패",
  signup: "회원가입",
  forgetPassword: "비밀번호를 잊으셨나요?",
  loginDescription: "계정에 로그인하여 마이페이지에 접근하세요.",
  resetPassword: "비밀번호 재설정",
  enterYourNewPassword: "새 비밀번호를 입력하세요.",
  passwordResetFailed: "비밀번호 재설정 실패",
  passwordUpdated: "비밀번호가 성공적으로 업데이트되었습니다.",
  weSentYouAnEmail:
    "이메일 {email}을 보내드렸습니다. 이메일 링크를 따라가 비밀번호를 재설정하세요.",
  changeEmail: "이메일 변경",
  enterEmailToResetPassword: "이메일을 입력하여 비밀번호를 재설정하세요.",
  creatorLogin: "크리에이터 로그인",
  searchCreators: {
    title: "크리에이터 검색",
    description: "xmrchat에서 공개 페이지가 있는 크리에이터를 검색하세요.",
  },
  typePageName: "페이지 이름 입력...",
  contactUs: "문의하기",
  here: "여기",

  xmrchat: "XMRChat",
  heroDescription: "좋아하는 스트리머에게 암호화폐로 팁을 주세요.",
  findCreators: "크리에이터 찾기",
  creatorsStartHere: "크리에이터는 여기서 시작하세요",

  FAQ: {
    title: "자주 묻는 질문",
    whyTipWithXMRChat: "왜 XMRChat으로 팁을 줘야 할까요?",
    whyUseMonero: "왜 XMRChat은 모네로를 사용하나요?",
    whereToGetMonero: "모네로를 어디서 구하나요?",
  },

  earnMore: {
    title: "더 많은 수익 창출",
    description:
      "YouTube는 Superchat에 30-50%를 떼어가고, Rumble은 Rants에 20%를 떼어갑니다. XMRChat을 사용하면 팬으로부터 받은 모네로 팁의 100%를 모네로 지갑으로 직접 받을 수 있습니다.",
  },
  censorshipResistant: {
    title: "검열 저항성",
    description:
      "모네로로 팁을 받으면, 빅테크 기업들의 자의적인 정책에 얽매이지 않고 수익을 창출할 수 있습니다.",
  },
  corruptionResistant: {
    title: "탄압 저항성",
    description:
      "많은 정부는 정적들의 은행 계좌를 압류하거나 동결합니다. 하지만 모네로를 사용하면 자산을 직접 관리할 수 있어 이런 위험으로부터 자유로울 수 있습니다.",
  },
  private: {
    title: "프라이버시 보호",
    description:
      "시청자는 익명으로 팁을 보낼 수 있으므로, 회사나 다른 사람들에게 팁을 보낸 사실이 알려질 걱정이 없습니다.",
  },
  quickAndEasy: {
    title: "빠르고 쉬움",
    description:
      "시청자는 계정 생성, 이메일 인증, 카드 정보 입력 없이 팁 페이지에서 이름, 메시지, 금액을 입력하고 모네로(Monero) 팁을 전송할 수 있습니다.",
  },
  openSource: {
    title: "오픈 소스",
    description:
      "XMRChat은 오픈 소스입니다. 코드는 {github}에서 확인할 수 있습니다.",
  },

  lowFees: {
    title: "저렴한 수수료",
    description:
      "모네로의 송금 수수료는 매우 저렴해서 몇십 원 정도에 불과합니다.",
  },
  privateMonero: {
    title: "프라이버시 보호",
    description:
      "대부분의 암호화폐는 공개 원장을 사용하지만, 모네로는 거래 데이터를 숨깁니다. 송금자, 수신자, 거래 금액은 블록체인에서 확인할 수 없습니다.",
  },
  accepted: {
    title: "사용 가능",
    description:
      "중앙화 거래소에서 암호화폐를 판매하는 번거로움을 피하세요. {xmrbazaar}와 {monerica}에서 모네로를 사용하는 상인에게 직접 상품이나 서비스를 구매하세요.",
  },
  andMore: {
    title: "그 외에도",
    description: "{getmonero}에서 모네로에 대해 더 알아보세요.",
  },

  whereToGetMonero: {
    cakeWallet:
      "{cakeWallet}에서 다른 암호화폐로 모네로를 구매하거나 교환하세요.",
    stealthex:
      "{stealthex} 및 {kycnot}에서 다른 암호화폐를 모네로로 교환하세요.",
    haveno:
      "{haveno}에서 KYC 없이 모네로를 구매하세요. {blog}에서 현금 우편 가이드를 확인하세요.",
    thisBlogPost: "이 블로그 포스트",
    kraken: "KYC가 있는 {kraken}에서 모네로를 구매하세요.",
    xmrbazaar:
      "{xmrbazaar}에서 상품이나 서비스를 판매하여 모네로를 획득하세요.",
    gupax: "{gupax}에서 모네로를 채굴하세요.",
    kunoAnneMedia: "{kunoAnneMedia}에서 모네로 모금 캠페인을 시작하세요.",
    monerica:
      "당신의 사업에서 모네로 결제를 허용하고 {monerica}, {monerodirectory} 그리고 {xmrbazaar}의 모네로 사용 가능 사업 목록에 등록되세요.",
  },

  tipName: "이름",
  tipAmount: "금액",
  tipMessage: "메시지",
  tipPrivate: "비공개",
  tipDate: "날짜",
  tipUpdated: "팁이 업데이트되었습니다!",
  tipPrivateTooltip: "이름과 메시지는 스트리머에게만 표시됩니다.",
  tipCoin: "코인",
  tipCoinPlaceholder: "모네로(Monero)",
  sendTip: "팁 보내기",
  tipCreationFailed: "팁 생성 실패",
  tipNamePlaceholder: "이름 입력",
  tipAmountPlaceholder: "금액 입력",
  tipMessagePlaceholder: "메시지 입력",
  tipPrivatePlaceholder: "비공개",
  tipSwapUnavailable: "현재 스왑을 사용할 수 없습니다.",
  tipSwapMinimum: "스왑 최소 금액은 {minSwapUSD}$입니다",
  minUsdAmount: "최소 {minUsdAmount}",
  recentTips: "최근 팁",
  tipDisplayValueTooltip: "팁 값을 모네로(Monero) 또는 USD로 표시",
  noRecentTips: "최근 팁이 없습니다!",
  pageDeactivatedAlert:
    "페이지가 비활성화되어 공개적으로 표시되지 않습니다. 자세한 내용은 지원팀에 문의하세요.",

  tipWalletWarningTitle: "스트리머 지갑으로 팁을 보내지 마세요.",
  tipWalletWarningDescription:
    "페이지에 등록된 지갑으로 팁을 보내는 것을 피해주세요. 반환되는 잔액으로 인해 수령된 금액이 부풀려집니다.",
  tipWalletMinimum:
    "xmrchat에 표시하려면 다음 주소로 최소 {minimumAmount} 모네로(Monero)을 보내주세요.",
  openInMyWallet: "내 지갑에서 열기",
  cancel: "취소",
  copyAddress: "주소 복사",
  waitingForPayment: "결제 대기 중",

  contactUsDescription: "질문이나 피드백이 있다면 문의해주세요.",
  contactUsForm: "문의 양식",
  contactUsFormDescription: "질문이나 피드백이 있다면 문의해주세요.",
  contactUsFormButton: "문의하기",
  emailUsDirectly: "직접 이메일 보내기",
  followUsOnTwitter: "트위터 팔로우",
  twitter: "트위터",

  createPage: "페이지 생성",
  getStartedCreatingPage: "스트리머 페이지를 만들어 시작하세요",
  home: "홈",
  logo: "로고",
  logoRatio: "1:1 비율",
  bannerImage: "배너 이미지",
  bannerImageBestRatio: "3:1 비율이 가장 좋습니다",
  yourId: "귀하의 ID",
  pageSlug: "페이지 슬러그",
  moneroPrmReciveAddress: "모네로 기본 수신 주소",
  prmMoneroReciveAdressBegin: "기본 모네로 수신 주소는 숫자 4로 시작합니다.",
  moneroSecretViewKey: "모네로 시크릿 뷰 키",
  weNeedSecretViewKey:
    "시청자의 입금 거래를 확인하기 위해 시크릿 뷰 키가 필요합니다. {whereToFind}",
  whereToFindViewKey: "뷰 키는 어디에서 찾을 수 있나요?",
  twitchChannelName: "트위치 채널 이름",
  nameOfYourTwitchChannel:
    "트위치 채널 이름입니다. xmr_chat 트위치 봇을 통해 스트림에 팁을 표시하는 데 사용됩니다.",
  optional: "선택 사항",
  minTipAmount: "최소 팁 금액 (XMR)",
  defaultTipAmount: "기본 팁 금액",
  thisIsOnlyForDisplaying:
    "이 값은 팁 페이지에 표시되는 기본값일 뿐입니다. 시청자가 원하는 대로 변경할 수 있습니다.",
  publicPage: "공개 페이지 (크리에이터 검색 페이지에 표시됨).",
  continue: "계속",
  clickToUpload: "클릭하여 업로드",
  pageCreatedSuccessfully: "페이지가 성공적으로 생성되었습니다!",
  slugReservedUntil: "슬러그는 다음 시점까지 예약됨: ",
  note: "참고",

  // STREAMER MENU
  menu: "메뉴",
  myXmrchats: "내 xmrchats",
  editTipPage: "팁 페이지 편집",
  tipPage: "팁 페이지",
  contentLinks: "콘텐츠 링크",
  obs: "OBS",
  show: "보기",
  hide: "숨김",

  // ACCOUNT PAGE
  changePassword: "비밀번호 변경",
  updateYourLoginPassword: "로그인 비밀번호 업데이트",
  currentPassword: "현재 비밀번호",
  newPassword: "새 비밀번호",
  repeatNewPassword: "새 비밀번호 확인",
  contactSupportForEmailChange: "지원팀에 문의하여 이메일 주소를 변경하세요.",

  // EDIT PAGE
  editPage: "페이지 편집",
  customizeYourTipPage: "팁 페이지를 맞춤 설정하세요.",
  errorCreatingUpdatingPage: "페이지 생성/업데이트 오류",
  tipAmountSuggestions: "팁 금액 제안",
  pageWillBeAvailableAt: "페이지는 {url}에서 이용 가능합니다",
  noSuggestedAmountsAdded:
    "추가된 제안 금액이 없습니다. 아래 버튼을 클릭하여 새 단계를 추가하세요.",
  addTier: "단계 추가",
  remove: "제거",
  name: "이름",
  amountUSD: "금액 (USD)",

  // CONTENT LINKS
  brandName: "브랜드 이름",
  brandNameHelp: "브랜드/콘텐츠 이름. 페이지 주소와 다를 수 있습니다.",
  searchTerms: "검색어",
  searchTermsHelp:
    "크리에이터를 검색하면 이 목록에 있는 페이지 주소, 이름, 키워드를 바탕으로 결과가 나옵니다.",
  contentLinksDescription: "이름, 검색어 및 콘텐츠 링크",
  contentLinksSecondDescription:
    "소셜 페이지나 웹사이트 링크. 값을 재설정하려면 필드를 비워두세요.",
  saveChanges: "변경사항 저장",
  notUrlWithMessage: "전체 링크 대신 이름만 입력하세요.",
  changesAreSaved: "변경사항이 저장되었습니다.",
  errorSavingChanges: "변경사항 저장 오류.",
  xUsername: "{platform} 사용자 이름",
  websiteLink: "웹사이트 링크",
  youtubeChannel: "유튜브 채널",
  podcastRssLink: "팟캐스트 RSS 링크",
  nostrPubKey: "Nostr 공개 키",

  // OBS
  obsDescription: "OBS 위젯 및 설정.",
  settingsAreUpdated: "설정이 업데이트되었습니다.",
  errorUpdatingSettings: "설정 업데이트 오류",
  toUseXMRchatsOnOBS:
    "OBS에서 XMRChat을 사용하려면 OBS 페이지 링크를 복사하여 OBS 소스의 '브라우저'에 추가하세요.",
  copyOBSLink: "OBS 페이지 링크 복사",
  obsPageSettings: "OBS 페이지 설정",
  preventMessagesFromFading: "메시지 페이드 아웃 방지",
  preventMessagesFromFadingDescription:
    "활성화하면 최신 팁이 화면에 유지되고, 그렇지 않으면 각 메시지가 60초 동안 표시됩니다.",
  playSound: "소리 재생",
  playSoundDescription: "새 팁이 나타날 때 OBS 페이지에서 소리를 재생합니다.",
  playSoundDescriptionLocal:
    "브라우저에서 이 기능을 로컬로 테스트하는 경우, obs 탭을 열고 페이지 어딘가를 클릭하세요. 그렇지 않으면 열린 탭과의 상호작용이 없어 브라우저가 소리를 재생하지 않습니다.",
  autoShowTips: "자동 팁 표시",
  autoShowTipsDescription:
    "활성화하면 OBS 페이지에서 60초 동안 팁이 자동으로 표시됩니다.",

  // HEAD
  head: {
    description:
      "시청자 여러분, 쉽게 그리고 프라이버시를 지키며 메시지와 팁을 보내세요. 스트리머는 빅테크에 30~50%를 넘기는 대신 거의 모든 팁을 유지할 수 있습니다.",
    title: "Monero로 메시지 및 팁 보내기",
    XMRChatTip: "XMRChat - {path}에게 Monero로 팁 주기",
    tip: "{path}에게 팁 주기",
  },
  moneroSuperchats: "Monero 슈퍼챗 : XMRChat",
};
