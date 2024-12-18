<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type {
  CreateFormFields,
  TipCreationResponse,
  TipFormFields,
  Tip,
  StreamerPage,
} from "~/types";

const props = defineProps<{
  streamerId: string;
  streamerPage?: StreamerPage | null;
}>();

const { required, minLength, maxLength, minValue } = useValidations();
const { sendTipToStreamer: sendTipToStreamerApi, getPrice } = useServices();

const { minUsdAmount, price } = useXmrPrice({
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
});

const v = useVuelidate<State["form"]>(
  computed(() => {
    return {
      name: { required, minLength: minLength(2), maxLength: maxLength(40) },
      amount: { required, minValue: minValue(minUsdAmount.value) },
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
            />
            <template #hint>
              <span class="text-xs">Minimum ${{ minUsdAmount }}</span>
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

        <div class="single">
          <UAlert
            color="red"
            :description="state.errorMessage"
            title="Tip Creation Failed"
            v-if="state.errorMessage"
          >
          </UAlert>
        </div>

        <div class="flex">
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
