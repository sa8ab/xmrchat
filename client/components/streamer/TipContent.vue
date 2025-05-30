<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type {
  TipCreationResponse,
  TipFormFields,
  StreamerPage,
  Coin,
} from "~/types";
import { FiatEnum, TipDisplayMode } from "~/types/enums";

const props = defineProps<{
  streamerId: string;
  streamerPage?: StreamerPage | null;
}>();

const { required, minLength, maxLength, minValue } = useValidations();
const { sendTipToStreamer: sendTipToStreamerApi } = useServices();
const coins = useState<Coin[]>("coins");
const swapActive = useState<boolean>("swapActive");
const { t } = useI18n();
const { state: generalState } = useGeneralStore();

const { minFiatAmount, price, minSwapFiatAmount, minXmr, minSwapXMR } =
  useMinTipAmount({
    pageMinXmr: computed(() => props.streamerPage?.minTipAmount),
    pageFiat: computed(() => props.streamerPage?.fiat),
  });
const { money } = useMoney();

const emit = defineEmits<{
  done: [TipCreationResponse];
}>();

interface State {
  form: TipFormFields;
  buttonsAmount: any;
  loading: boolean;
  errorMessage?: string;
  selectedCoin?: number;
}

const state = reactive<State>({
  form: {
    name: undefined,
    amount: undefined,
    message: undefined,
    private: false,
  },
  buttonsAmount: [3, 5, 10, 12],
  loading: false,
  errorMessage: undefined,
  selectedCoin: undefined,
});

const v = useVuelidate<State["form"]>(
  computed(() => {
    const minXmrValue = state.selectedCoin ? minSwapXMR.value : minXmr.value;
    const minFiatValue = state.selectedCoin
      ? minSwapFiatAmount.value
      : minFiatAmount.value;
    return {
      name: { required, minLength: minLength(2), maxLength: maxLength(40) },
      amount: {
        required,
        minValue: minValue(
          generalState.tipDisplayValue === TipDisplayMode.XMR
            ? minXmrValue
            : minFiatValue
        ),
      },
      message: { minLength: minLength(3), maxLength: maxLength(255) },
    };
  }),
  toRef(state, "form")
);

const { getValidationAttrs } = useValidations(v);

const handleSubmit = async () => {
  v.value.$touch();
  const valid = await v.value.$validate();
  if (!valid) return;
  state.errorMessage = undefined;
  try {
    state.loading = true;

    let xmrAmount;
    if (generalState.tipDisplayValue === TipDisplayMode.XMR) {
      xmrAmount = state.form.amount;
    } else {
      xmrAmount = (state.form.amount / (price.value as number)).toFixed(8);
    }

    const response = await sendTipToStreamerApi(props.streamerId, {
      ...state.form,
      message: state.form.message || undefined,
      amount: xmrAmount,
      coinId: state.selectedCoin,
    });

    emit("done", response);
  } catch (error) {
    state.errorMessage = getErrorMessage(error);
  } finally {
    state.loading = false;
  }
};

defineExpose({
  reset: () => {
    v.value.$reset();
    state.form = {
      amount: undefined,
      message: undefined,
      name: undefined,
      private: false,
    };
  },
});

const messageLength = computed(() => state.form.message?.length || 0);

const coinSelectOptions = computed(() => {
  return [
    {
      label: "XMR",
      name: "Monero",
      id: null,
      image: "https://trocador.app/static/img/icons/xmr.svg",
    },
    ...coins.value?.map((c) => ({
      label: c.ticker.toUpperCase(),
      name: c.name,
      id: c.id,
      image: c.image,
    })),
  ];
});

const { getFiat } = useConstants();
const fiat = computed(() => getFiat(props.streamerPage?.fiat || FiatEnum.USD));
const renderInputPrefix = computed(() => {
  if (generalState.tipDisplayValue === TipDisplayMode.XMR) return "XMR";
  return fiat.value.symbol;
});
const renderInputPadding = computed(
  () => `${renderInputPrefix.value.length * 0.6 + 2}rem`
);
</script>

<template>
  <div class="payment pt-5 md:pt-10 gap-10">
    <div class="content-side">
      <UForm
        class="flex flex-col gap-5"
        :state="state.form"
        @submit="handleSubmit"
      >
        <div class="both pb-4">
          <UFormGroup
            size="lg"
            :label="t('tipName')"
            :error="getValidationAttrs('name').error"
            name="name"
          >
            <UInput
              type="text"
              v-model="state.form.name"
              @blur="getValidationAttrs('name').onBlur"
            />
          </UFormGroup>

          <UFormGroup
            size="lg"
            :label="t('tipAmount')"
            :error="getValidationAttrs('amount').error"
            name="amount"
          >
            <UInput
              v-model="state.form.amount"
              @blur="getValidationAttrs('amount').onBlur"
              :style="{ paddingStart: renderInputPadding }"
            >
              <template #leading>
                <span
                  class="text-pale flex items-center text-center justify-center"
                >
                  {{ renderInputPrefix }}
                </span>
              </template>
            </UInput>
            <!-- <TipTiers
              :tiers="streamerPage?.tiers"
              @select="state.form.amount = $event"
              :fiat="streamerPage?.fiat"
              v-if="streamerPage?.tiers?.length"
            /> -->
            <template #hint>
              <TipInputHint
                :selectedCoin="state.selectedCoin"
                :page="streamerPage"
              />
            </template>
          </UFormGroup>
        </div>

        <div class="single">
          <UFormGroup
            :error="getValidationAttrs('message').error"
            :label="t('tipMessage')"
            name="message"
            :hint="`${messageLength} / 255`"
          >
            <UTextarea
              @blur="getValidationAttrs('message').onBlur"
              v-model="state.form.message"
              :placeholder="t('tipMessagePlaceholder')"
            />
          </UFormGroup>
        </div>

        <div class="single">
          <UTooltip :popper="{ placement: 'top' }">
            <template #text>
              <p>{{ t("tipPrivateTooltip") }}</p>
            </template>
            <UCheckbox
              color="primary"
              :label="t('tipPrivate')"
              v-model="state.form.private"
            />
          </UTooltip>
        </div>

        <div class="singe">
          <div class="flex">
            <UFormGroup :label="t('tipCoin')">
              <USelectMenu
                :options="coinSelectOptions"
                v-model="state.selectedCoin"
                trailingIcon="i-heroicons-chevron-up-down-16-solid"
                :placeholder="t('tipCoinPlaceholder')"
                value-attribute="id"
                :uiMenu="{}"
                :ui="{ wrapper: 'min-w-[160px]' }"
                :disabled="!swapActive"
              >
                <template #option="{ option }">
                  <div class="flex items-center gap-2">
                    <img :src="option.image" class="w-4 h-4" />
                    <div class="flex flex-col">
                      <span>{{ option.label }}</span>
                      <span class="text-xs text-pale">{{ option.name }}</span>
                    </div>
                  </div>
                </template>
              </USelectMenu>
              <template #help v-if="!swapActive">
                <p class="text-xs">{{ t("tipSwapUnavailable") }}</p>
              </template>
            </UFormGroup>
          </div>
          <!-- <p v-if="!false" class="text-pale text-sm mt-1"></p> -->
        </div>

        <div class="single" v-if="state.errorMessage">
          <UAlert
            color="red"
            :description="state.errorMessage"
            :title="t('tipCreationFailed')"
          >
          </UAlert>
        </div>

        <UButton
          size="lg"
          type="submit"
          :loading="state.loading"
          class="flex items-center gap-2 w-fit"
        >
          {{ $t("sendTip") }}
          <DirectionalArrow />
        </UButton>
      </UForm>
    </div>
    <div class="tip-side">
      <RecentTipsSidebar :slug="streamerId" :page="streamerPage" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.payment {
  @apply grid;
  grid-template-columns: 1fr 380px;
}
.buttons {
  @apply inline-flex gap-1 pt-2;
}

@media screen and (max-width: 860px) {
  .payment {
    // 1fr 1fr instead of one 1fr allows 100% width on tip-side
    grid-template-columns: 1fr 1fr;
  }
  .content-side,
  .tip-side {
    grid-column: 1 / 3;
  }
}
</style>
