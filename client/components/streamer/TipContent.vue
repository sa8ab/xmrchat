<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type {
  TipCreationResponse,
  TipFormFields,
  StreamerPage,
  Coin,
} from "~/types";

const props = defineProps<{
  streamerId: string;
  streamerPage?: StreamerPage | null;
}>();

const { required, minLength, maxLength, minValue } = useValidations();
const { sendTipToStreamer: sendTipToStreamerApi, getPrice } = useServices();
const coins = useState<Coin[]>("coins");
const swapActive = useState<boolean>("swapActive");

const { minUsdAmount, price, minSwapUSD } = useXmrPrice({
  pageMinXmr: computed(() => props.streamerPage?.minTipAmount),
});

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
    return {
      name: { required, minLength: minLength(2), maxLength: maxLength(40) },
      amount: {
        required,
        minValue: minValue(
          state.selectedCoin ? minSwapUSD.value : minUsdAmount.value
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

    if (!price.value) {
      price.value = await getPrice();
    }

    const xmrAmount = (state.form.amount / (price.value as number)).toFixed(8);

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
      id: null,
      image: "https://trocador.app/static/img/icons/xmr.svg",
    },
    ...coins.value?.map((c) => ({ label: c.name, id: c.id, image: c.image })),
  ];
});
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
            label="Enter name"
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
            label="Enter Tip Amount"
            :error="getValidationAttrs('amount').error"
            name="amount"
          >
            <UInput
              v-model="state.form.amount"
              @blur="getValidationAttrs('amount').onBlur"
              icon="i-mdi-currency-usd"
            />
            <TipTiers
              :tiers="streamerPage?.tiers"
              @select="state.form.amount = $event"
              v-if="streamerPage?.tiers?.length"
            />
            <template #hint>
              <span class="text-xs" v-if="state.selectedCoin"
                >Swap Minimum ${{ minSwapUSD }}</span
              >
              <span class="text-xs" v-else>Minimum ${{ minUsdAmount }}</span>
            </template>
          </UFormGroup>
        </div>

        <div class="single">
          <UFormGroup
            :error="getValidationAttrs('message').error"
            label="Message"
            name="message"
            :hint="`${messageLength} / 255`"
          >
            <UTextarea
              @blur="getValidationAttrs('message').onBlur"
              v-model="state.form.message"
              placeholder="Enter message..."
            />
          </UFormGroup>
        </div>

        <div class="single">
          <UTooltip :popper="{ placement: 'top' }">
            <template #text>
              <p>Name and message will be only visible to the streamer.</p>
            </template>
            <UCheckbox
              color="primary"
              label="Tip Privately"
              v-model="state.form.private"
            />
          </UTooltip>
        </div>

        <div class="singe">
          <div class="flex">
            <UFormGroup label="Tip coin">
              <USelectMenu
                :options="coinSelectOptions"
                v-model="state.selectedCoin"
                trailingIcon="i-heroicons-chevron-up-down-16-solid"
                placeholder="XMR"
                value-attribute="id"
                :uiMenu="{ width: 'w-full' }"
                :ui="{ wrapper: 'min-w-[120px]' }"
                :disabled="!swapActive"
              >
                <template #option="{ option }">
                  <div class="flex items-center gap-2 truncate">
                    <img :src="option.image" class="w-4 h-4" />
                    <span>{{ option.label }}</span>
                  </div>
                </template>
              </USelectMenu>
              <template #help v-if="!swapActive">
                <p class="text-xs">Swap is currently unavailable.</p>
              </template>
            </UFormGroup>
          </div>
          <!-- <p v-if="!false" class="text-pale text-sm mt-1"></p> -->
        </div>

        <div class="single" v-if="state.errorMessage">
          <UAlert
            color="red"
            :description="state.errorMessage"
            title="Tip Creation Failed"
          >
          </UAlert>
        </div>

        <div class="">
          <UButton
            size="lg"
            type="submit"
            :loading="state.loading"
            trailingIcon="i-heroicons-arrow-small-right"
          >
            Send Tip
          </UButton>
        </div>
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
