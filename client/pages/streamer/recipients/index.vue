<script setup lang="ts">
import { type PageRecipient } from "@/types/general";
import { PageRecipientVariant } from "~/types/enums";

const state = reactive<{
  recipients: PageRecipient[];
  page?: PageRecipient;
  xmrchat?: PageRecipient;
}>({
  recipients: [],
  page: undefined,
  xmrchat: undefined,
});

const { axios } = useApp();
const {} = useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ pageRecipients: PageRecipient[] }>(
      "/page-recipients"
    );

    const page = getStateRecipient(
      data.pageRecipients,
      PageRecipientVariant.PAGE
    ) || {
      variant: PageRecipientVariant.PAGE,
      name: "Page Address",
    };
    state.page = page;

    const xmrchat = getStateRecipient(
      data.pageRecipients,
      PageRecipientVariant.XMRCHAT
    ) || {
      variant: PageRecipientVariant.XMRCHAT,
      name: "XMRChat",
    };
    state.xmrchat = xmrchat;

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
            percentage: 80,
          }"
        />
        <RecipientItem
          :modelValue="{ name: 'XMRChat', address: '4CscFcV...RQ8RZX' }"
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
      <div class="flex gap-2 mt-4">
        <UButton type="button">Save</UButton>
        <UButton variant="outline" @click="addRecipient" type="button">
          Add recipient
        </UButton>
      </div>
    </GeneralForm>
  </div>
</template>
