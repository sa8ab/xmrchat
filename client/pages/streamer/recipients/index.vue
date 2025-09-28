<script setup lang="ts">
import { type PageRecipient } from "@/types/general";
import useVuelidate from "@vuelidate/core";
import { maxLength } from "@vuelidate/validators";
import { PageRecipientVariant } from "~/types/enums";

// we have two static recipients. XMRChat recipient and creators own recipient.
// thats means creators can create max 8 recipients.
const MAX_RECIPIENT_LENGTH = 8;
const state = reactive<{
  recipients: PageRecipient[];
  page: PageRecipient;
  xmrchat: PageRecipient;
  loading: boolean;
  loadingReset: boolean;
}>({
  recipients: [],
  page: {
    variant: PageRecipientVariant.PAGE,
  },
  xmrchat: {
    variant: PageRecipientVariant.XMRCHAT,
    percentage: 0,
  },
  loading: false,
  loadingReset: false,
});

const { axios } = useApp();
const toast = useToast();
const authStore = useAuthStore();

const pageAddress = computed(() => authStore.state.page?.primaryAddress);

const { refresh } = useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ recipients: PageRecipient[] }>(
      "/page-recipients",
    );

    // Add page recipient
    const page = getStateRecipient(data.recipients, PageRecipientVariant.PAGE);
    if (page) state.page.percentage = page.percentage;

    // Add xmrchat recipient
    const xmrchat = getStateRecipient(
      data.recipients,
      PageRecipientVariant.XMRCHAT,
    );
    state.xmrchat.percentage = xmrchat?.percentage ?? 0;

    // Add recipients
    state.recipients = data.recipients.filter(({ variant }) => {
      return variant == PageRecipientVariant.RECIPIENT;
    });

    return data.recipients;
  },
  { server: false },
);

const handleSave = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;
  state.loading = true;

  try {
    const recipients = [...state.recipients];
    recipients.push({
      variant: PageRecipientVariant.PAGE,
      percentage: remainingPagePercentage.value,
    });
    recipients.push({
      ...state.xmrchat,
      address: undefined,
      name: undefined,
    });
    await axios.post("/page-recipients", {
      recipients,
    });
    toast.add({
      description: "Recipients updated successfully",
      color: "green",
    });
    await authStore.getMe();
  } catch (error) {
    toast.add({
      description: getErrorMessage(error),
      color: "red",
    });
  } finally {
    state.loading = false;
  }
};

const handleReset = async () => {
  state.loadingReset = true;
  try {
    await axios.post("/page-recipients/reset");
    toast.add({
      description: "Recipients reset successfully",
      color: "green",
    });
    await refresh();
    await authStore.getMe();
  } catch (error) {
    toast.add({
      description: getErrorMessage(error),
      color: "red",
    });
  } finally {
    state.loadingReset = false;
  }
};

const getStateRecipient = (
  data: PageRecipient[],
  variant: PageRecipientVariant,
) => {
  return data.find((d) => d.variant === variant) as PageRecipient;
};

const addRecipient = () => {
  state.recipients.push({
    variant: PageRecipientVariant.RECIPIENT,
  });
};

const removeRecipient = (index: number) => {
  state.recipients = state.recipients.filter((_, i) => i != index);
};

const remainingPagePercentage = computed(() => {
  const xmrchat = Number(state.xmrchat?.percentage) || 0;

  let sum =
    state.recipients.reduce((acc, curr) => {
      return acc + (Number(curr.percentage) ?? 0);
    }, 0) || 0;

  const res = 100 - (xmrchat + sum);
  return res ?? 100;
});

const rules = computed(() => {
  return {
    recipients: {
      maxLength: maxLength(MAX_RECIPIENT_LENGTH),
    },
  };
});

const isRecipientLimitReached = computed(() => {
  return state.recipients.length >= MAX_RECIPIENT_LENGTH ? true : false;
});

const v = useVuelidate(rules, state);
</script>

<template>
  <div>
    <PageTitle
      title="Tip Recipients"
      description="Split a portion of your tips to more recipients"
    />
    <GeneralForm @submit="handleSave">
      <div class="grid gap-6 lg:gap-4">
        <RecipientItem
          :modelValue="{
            variant: PageRecipientVariant.PAGE,
            name: `${authStore.pageName} address`,
            address: pageAddress,
            percentage: remainingPagePercentage,
          }"
          truncateAddress
        />
        <RecipientItem
          v-model="state.xmrchat"
          name="XMRChat"
          address="Thanks for your support!"
          editablePercentage
        />
        <RecipientItem
          v-for="(item, i) in state.recipients"
          v-model="state.recipients[i]"
          editableAddress
          editablePercentage
          showDelete
          @delete="removeRecipient(i)"
        />
      </div>
      <div class="flex gap-2 mt-6 justify-between flex-wrap">
        <UAlert
          v-show="isRecipientLimitReached"
          icon="i-heroicons-no-symbol"
          variant="outline"
          title="Recipients Limit!"
          :description="`Recipients must contain no more than ${MAX_RECIPIENT_LENGTH + 2} elements`"
        />
        <div class="flex gap-2">
          <UButton type="submit" :loading="state.loading">Save</UButton>
          <UButton
            :disabled="isRecipientLimitReached"
            variant="outline"
            type="button"
            @click="addRecipient"
          >
            Add recipient
          </UButton>
        </div>
        <div>
          <UButton
            color="red"
            variant="outline"
            type="button"
            :loading="state.loadingReset"
            @click="handleReset"
          >
            Reset recipients
          </UButton>
        </div>
      </div>
    </GeneralForm>
  </div>
</template>
