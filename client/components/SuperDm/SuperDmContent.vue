<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { Coin, StreamerPage, SuperDmResponse } from "~/types";
import { FiatEnum, TipDisplayMode } from "~/types/enums";

const props = defineProps<{
  streamerId: string;
  streamerPage?: StreamerPage | null;
}>();
const emit = defineEmits<{
  done: [SuperDmResponse];
}>();

const coins = useState<Coin[]>("coins");
const swapActive = useState<boolean>("swapActive");

const { t } = useI18n();
const { state: generalState } = useGeneralStore();
const { required, minLength, maxLength, minValue } = useValidations();

const { minFiatAmount, price, minSwapFiatAmount, minXmr, minSwapXMR } =
  useMinSuperDmAmount({
    pageMinXmr: computed(() => props.streamerPage?.minTipAmount),
    pageFiat: computed(() => props.streamerPage?.fiat),
  });

interface State {
  form: {
    name?: string;
    amount?: string | number;
  };
  loading: boolean;
  errorMessage?: string;
  selectedCoin?: number;
}

const state = reactive<State>({
  form: {
    name: undefined,
    amount: undefined,
  },
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
    };
  }),
  computed(() => state.form)
);

const { getValidationAttrs } = useValidations(v);

defineExpose({
  reset: () => {
    // v.value.$reset();
    state.form = {
      amount: undefined,
      name: undefined,
    };
  },
});

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

const handleSubmit = async () => {};
</script>

<template>
  <div class="pt-5 md:pt-10">
    <GeneralForm>
      <div class="grid gap-6">
        <div class="both">
          <UFormGroup
            size="lg"
            label="Name"
            :error="getValidationAttrs('name').error"
            name="name"
          >
            <UInput
              v-model="state.form.name"
              @blur="getValidationAttrs('name').onBlur"
            />
          </UFormGroup>
          <UFormGroup
            size="lg"
            label="Amount"
            :error="getValidationAttrs('amount').error"
            name="amount"
          >
            <UInput
              v-model="state.form.amount"
              :style="{ paddingStart: renderInputPadding }"
              @blur="getValidationAttrs('amount').onBlur"
            >
              <template #leading>
                <span
                  class="text-pale flex items-center text-center justify-center"
                >
                  {{ renderInputPrefix }}
                </span>
              </template>
            </UInput>
            <template #hint>
              <TipInputHint
                :selectedCoin="state.selectedCoin"
                :page="streamerPage"
              />
            </template>
          </UFormGroup>
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
            title="Super DM could not be started"
          >
          </UAlert>
        </div>

        <div class="text-pale"></div>

        <div class="flex gap-2">
          <UButton
            size="lg"
            type="submit"
            :loading="state.loading"
            class="flex items-center gap-2 w-fit"
          >
            Start Super DM
          </UButton>
          <UButton variant="ghost" size="lg"> Open Super DM </UButton>
        </div>
      </div>
    </GeneralForm>
  </div>
</template>

<style scoped></style>
