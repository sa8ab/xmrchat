<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    editableAddress?: boolean;
    editablePercentage?: boolean;
    showDelete?: boolean;
  }>(),
  {
    editableAddress: false,
    editablePercentage: false,
    showDelete: false,
  }
);
</script>

<template>
  <div class="grid grid-cols-[1fr_100px_auto]">
    <div>
      <!-- name and address -->
      <div v-if="editableAddress">
        <UFormGroup label="Name">
          <UInput />
        </UFormGroup>
      </div>
      <div>
        <div class="font-medium">Address</div>
        <p>4CscFcV...RQ8RZX</p>
      </div>
    </div>
    <div>
      <!-- percentage -->
      <div v-if="editablePercentage"></div>
      <div v-else>
        <div class="font-medium">Percentage</div>
        <p>80%</p>
      </div>
    </div>
    <div>
      <!-- delete -->
    </div>
  </div>
</template>

<style scoped></style>
