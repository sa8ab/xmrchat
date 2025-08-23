<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { PageRecipient } from "~/types";

const model = defineModel<PageRecipient>({ default: () => ({}) });

const props = withDefaults(
  defineProps<{
    editableAddress?: boolean;
    editablePercentage?: boolean;
    showDelete?: boolean;
    truncateAddress?: boolean;
  }>(),
  {
    editableAddress: false,
    editablePercentage: false,
    showDelete: false,
    truncateAddress: false,
  }
);

const emit = defineEmits<{
  delete: [];
}>();

const { required, moneroPrimaryAddress, numberic, between } = useValidations();

const v = useVuelidate<any>(
  computed(() => {
    return {
      name: { required },
      address: props.editableAddress ? { required, moneroPrimaryAddress } : {},
      percentage: props.editablePercentage
        ? { required, numberic, between: between(0, 100) }
        : {},
    };
  }),
  model
);

const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <div
    class="grid grid-cols-1 lg:grid-cols-[1fr_160px_auto] gap-2 border border-border p-4 rounded-lg lg:border-none lg:p-0 lg:rounded-none"
  >
    <div>
      <!-- name and address -->
      <div v-if="editableAddress" class="flex gap-2">
        <UFormGroup
          label="Name"
          size="lg"
          :error="getValidationAttrs('name').error"
        >
          <UInput
            v-model="model.name"
            @blur="getValidationAttrs('name').onBlur"
          />
        </UFormGroup>
        <UFormGroup
          label="Address"
          size="lg"
          class="flex-grow"
          :error="getValidationAttrs('address').error"
        >
          <UInput
            v-model="model.address"
            @blur="getValidationAttrs('address').onBlur"
          />
        </UFormGroup>
      </div>
      <div v-else>
        <div class="font-medium">{{ model.name }}</div>
        <p>
          {{
            model.address
              ? truncateAddress
                ? truncateMiddle(model.address, 4, 4)
                : model.address
              : ""
          }}
        </p>
      </div>
    </div>
    <div>
      <!-- percentage -->
      <div v-if="editablePercentage">
        <UFormGroup
          label="Percentage %"
          size="lg"
          :error="getValidationAttrs('percentage').error"
        >
          <UInput
            v-model="model.percentage"
            @blur="getValidationAttrs('percentage').onBlur"
          />
        </UFormGroup>
      </div>
      <div v-else>
        <div class="font-medium">Percentage</div>
        <p>{{ model.percentage }}%</p>
      </div>
    </div>
    <div class="min-w-[140px] flex justify-end">
      <!-- delete -->
      <div v-if="showDelete">
        <span class="mb-1 text-sm hidden lg:flex">&nbsp;</span>
        <UButton color="red" size="lg" type="button" @click="emit('delete')">{{
          $t("remove")
        }}</UButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
