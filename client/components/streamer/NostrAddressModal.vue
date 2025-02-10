<script lang="ts" setup>
import QrcodeVue from "qrcode.vue";

const model = defineModel<boolean>();

const props = defineProps<{
  nostr?: string;
}>();
</script>

<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-icon-nostr" size="28px" class="text-[#a915ff]" />
          <h2 class="text-lg font-medium">Nostr Pub Key</h2>
        </div>
      </template>
      <div class="flex flex-col items-center">
        <p>Scan the qr code or copy the Nostr Pub Key.</p>
        <QrcodeVue
          v-if="nostr"
          :margin="4"
          :value="nostr"
          :size="256"
          level="M"
          class="rounded-lg"
        >
        </QrcodeVue>

        <PaymentAddressDisplay :address="nostr" class="mt-4" />
      </div>
      <template #footer>
        <div class="flex justify-end">
          <UButton size="lg" variant="ghost" @click="model = false">
            Close
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
