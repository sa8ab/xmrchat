<script lang="ts" setup>
import type { Numberic, TipTierField } from "~/types";
// @ts-ignore
import { ValidateEach } from "@vuelidate/components";

const tiers = defineModel<TipTierField[]>({
  default: () => [],
});

const props = defineProps<{
  minUsdAmount: Numberic;
}>();

const { getValidationAttrs, required, numberic, minLength, minValue } =
  useValidations();

const handleRemove = (index: number) => {
  tiers.value = tiers.value.filter((_, i) => i !== index);
};

const newTier = () => {
  tiers.value.push({
    description: "",
    amount: undefined,
  });
};

const rules = computed(() => {
  return {
    amount: {
      required,
      numberic,
      minValue: minValue(toRef(props, "minUsdAmount") as Ref<string>),
    },
    name: { required, minLength: minLength(3) },
  };
});
</script>

<template>
  <div class="streamer-tiers">
    <div class="items flex flex-col gap-3 py-2">
      <template v-if="tiers.length">
        <ValidateEach
          v-for="(item, index) of tiers"
          :state="item"
          :rules="rules"
        >
          <template #default="{ v }">
            <div class="item flex items-end gap-2">
              <UFormGroup
                label="Name"
                :error="getValidationAttrs('name', v).error"
              >
                <UInput
                  v-model="item.name"
                  @blur="getValidationAttrs('name', v).onBlur"
                >
                </UInput>
              </UFormGroup>
              <UFormGroup
                label="Amount ( USD )"
                :error="getValidationAttrs('amount', v).error"
              >
                <UInput
                  v-model="item.amount"
                  @blur="getValidationAttrs('amount', v).onBlur"
                >
                </UInput>
              </UFormGroup>
              <UButton color="red" @click="handleRemove(index)" type="button">
                Remove
              </UButton>
            </div>
          </template>
        </ValidateEach>
      </template>

      <div v-else class="no-tiers text-sm text-pale">
        There are no suggested amounts added, Click the button bellow to add new
        tiers.
      </div>
    </div>
    <UButton
      icon="i-heroicons-plus"
      variant="outline"
      @click="newTier"
      size="sm"
      class="mt-2"
      type="button"
    >
      Add Tier
    </UButton>
  </div>
</template>

<style scoped lang="scss">
.buttons {
  @apply inline-flex gap-2 mt-2;
}
</style>
