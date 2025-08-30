<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { PageRecipient } from "~/types";

const model = defineModel<PageRecipient>({ default: () => ({}) });

const props = withDefaults(
  defineProps<{
    editableAddress?: boolean;
    editablePercentage?: boolean;
    showDelete?: boolean;
    name?: string;
    address?: string;
  }>(),
  {
    editableAddress: false,
    editablePercentage: false,
    showDelete: false,
  }
);

const emit = defineEmits<{
  delete: [];
}>();

const { required, integer, between, minLength, maxLength } = useValidations();

const v = useVuelidate<any>(
  computed(() => {
    return {
      name: props.editableAddress ? { required } : {},
      address: props.editableAddress
        ? { required, minLength: minLength(95), maxLength: maxLength(106) }
        : {},
      percentage: props.editablePercentage
        ? { required, integer, between: between(0, 100) }
        : {},
    };
  }),
  model
);

const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <div
    :class="[
      'grid grid-cols-2 gap-2 border border-border p-4 rounded-lg lg:border-none lg:p-0 lg:rounded-none lg:grid-cols-[200px_1fr_160px_auto]',
    ]"
  >
    <template v-if="editableAddress">
      <!-- name  -->
      <UFormGroup
        class="flex-grow"
        label="Name"
        size="lg"
        :error="getValidationAttrs('name').error"
      >
        <UInput
          v-model="model.name"
          @blur="getValidationAttrs('name').onBlur"
        />
      </UFormGroup>
      <div class="col-span-2 lg:col-span-1 col-start-1 lg:col-start-auto">
        <!-- address -->
        <UFormGroup
          label="Your wallet address"
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
    </template>

    <div v-else class="lg:col-span-2 self-center lg:self-auto">
      <!-- name and address -->
      <div class="font-medium">{{ name || model.name }}</div>
      <p>
        {{ address || truncateMiddle(model.address || "", 4, 4) }}
      </p>
    </div>

    <!-- percentage -->
    <div
      v-if="editablePercentage"
      class="row-start-1 col-start-2 lg:row-start-auto lg:col-start-auto"
    >
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
    <div class="min-w-[140px] flex justify-end col-span-full lg:col-span-1">
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
