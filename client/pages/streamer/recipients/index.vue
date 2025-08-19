<script setup lang="ts">
import { type PageRecipient } from "@/types/general";
import { PageRecipientVariant } from "~/types/enums";

const state = reactive<{
  recipients: PageRecipient[];
  page?: PageRecipient;
  xmrchat?: PageRecipient;
}>({
  recipients: [],
  page: {
    variant: PageRecipientVariant.PAGE,
    name: "Page Address",
  },
  xmrchat: {
    variant: PageRecipientVariant.XMRCHAT,
    name: "XMRChat",
    address: "XMRChat address",
  },
});

const { axios } = useApp();
const {} = useLazyAsyncData(
  async () => {
    // const { data } = await axios.get<{ pageRecipients: PageRecipient[] }>(
    //   "/page-recipients"
    // );

    const data = { pageRecipients: [] };

    const page = getStateRecipient(
      data.pageRecipients,
      PageRecipientVariant.PAGE
    );
    if (page) state.page = page;

    const xmrchat = getStateRecipient(
      data.pageRecipients,
      PageRecipientVariant.XMRCHAT
    );
    if (xmrchat) state.xmrchat = xmrchat;

    state.recipients = data.pageRecipients.filter(({ variant }) => {
      return variant == PageRecipientVariant.RECIPIENT;
    });

    return data.pageRecipients;
  },
  { server: false }
);

const getStateRecipient = (
  data: PageRecipient[],
  variant: PageRecipientVariant
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

  let sum = state.recipients.reduce((acc, curr) => {
    return acc + (Number(curr.percentage) ?? 0);
  }, 0);

  const res = 100 - (xmrchat + sum);
  return res ?? 100;
});
</script>

<template>
  <div>
    <PageTitle
      title="Page Recipients"
      description="Manage the recipients of the page"
    />
    <GeneralForm>
      <div class="grid gap-4">
        <RecipientItem
          :modelValue="{
            name: 'Address',
            address: '4CscFcV...RQ8RZX',
            percentage: remainingPagePercentage,
          }"
        />
        <RecipientItem v-model="state.xmrchat" editablePercentage />
        <RecipientItem
          v-for="(item, i) in state.recipients"
          v-model="state.recipients[i]"
          editableAddress
          editablePercentage
          showDelete
          @delete="removeRecipient(i)"
        />
      </div>
      <div class="flex gap-2 mt-4">
        <UButton type="button">Save</UButton>
        <UButton variant="outline" @click="addRecipient" type="button">
          Add recipient
        </UButton>
      </div>
    </GeneralForm>
  </div>
</template>
