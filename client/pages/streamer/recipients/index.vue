<script setup lang="ts">
import { type PageRecipient } from "@/types/general";
import { PageRecipientVariant } from "~/types/enums";

const state = reactive<{
  recipients: PageRecipient[];
}>({
  recipients: [],
});

const { axios } = useApp();
const {} = useLazyAsyncData(
  async () => {
    // const {data} = await axios.get('/page-recipients')
  },
  { server: false }
);

const pageRecipient = computed(() => {
  return (
    state.recipients.find(
      ({ variant }) => variant === PageRecipientVariant.PAGE
    ) || {
      variant: PageRecipientVariant.PAGE,
      name: "Page Address",
    }
  );
});

const xmrChatRecipient = computed(() => {
  return (
    state.recipients.find(
      ({ variant }) => variant === PageRecipientVariant.XMRCHAT
    ) || {
      variant: PageRecipientVariant.XMRCHAT,
      address: "xmrchat address",
      name: "XMRChat",
    }
  );
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
            percentage: 80,
          }"
        />
        <RecipientItem
          :modelValue="{ name: 'XMRChat', address: '4CscFcV...RQ8RZX' }"
          editablePercentage
        />
        <RecipientItem editableAddress editablePercentage showDelete />
      </div>
      <div class="flex gap-2 mt-4">
        <UButton type="">Save</UButton>
        <UButton variant="outline">Add recipient</UButton>
      </div>
    </GeneralForm>
  </div>
</template>
