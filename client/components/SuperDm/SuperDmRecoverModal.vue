<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { SavedViewerSuperDmKeys, SuperDm } from "~/types";

const props = defineProps<{
  pagePath?: string;
}>();
const model = defineModel<boolean>();

const { axios } = useApp();
const { required } = useValidations();
const toast = useToast();
const {
  validateSamePrivateKeys,
  saveViewerKeys,
  recoverKeys,
  getViewerSavedKeys,
} = useSuperDm();
const { toSuperDm } = useRouteLocation();

const state = reactive({
  superDmId: "",
  recoveryCode: "",

  loading: false,
});

const savedKeys = ref<SavedViewerSuperDmKeys[] | undefined>([]);

const getSavedkeys = async () => {
  if (!props.pagePath) return;
  const keys = await getViewerSavedKeys({ pagePath: props.pagePath });
  savedKeys.value = keys;
};

const handleHide = () => {
  model.value = false;
};

const handleRecover = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;

  try {
    state.loading = true;
    const { data } = await axios.get<{ superDm: SuperDm }>(
      `/super-dms/${state.superDmId}`
    );
    if (!data.superDm) {
      throw createError("Super DM not found");
    }

    const keys = recoverKeys(state.recoveryCode);

    const samePrivateKeys = await validateSamePrivateKeys(
      data.superDm.publicKey,
      keys.publicKeyArmored
    );

    if (!samePrivateKeys) {
      throw createError("Invalid recovery code");
    }

    if (!props.pagePath) {
      throw createError("Page path is required");
    }

    console.log("rgferds");

    await saveViewerKeys({
      superDmId: state.superDmId,
      pagePath: props.pagePath,
      generatedKeys: keys,
    });

    await navigateTo(toSuperDm(props.pagePath, data.superDm.id));
  } catch (error) {
    toast.add({ description: getErrorMessage(error), color: "red" });
  } finally {
    state.loading = false;
  }
};

const v = useVuelidate<any>(
  {
    superDmId: { required },
    recoveryCode: { required },
  },
  state
);

const { getValidationAttrs } = useValidations(v);

watch(model, () => {
  if (model.value) {
    getSavedkeys();
  }
});
</script>

<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <h2 class="text-lg font-medium">Recover Super DM</h2>
      </template>
      <div class="grid gap-2">
        <p>
          Enter the Super DM id and recovery code of the Super DM you want to
          recover.
        </p>

        <UFormGroup
          label="Super DM id"
          :error="getValidationAttrs('superDmId').error"
        >
          <UInput
            v-model="state.superDmId"
            @blur="getValidationAttrs('superDmId').onBlur"
          />
        </UFormGroup>
        <UFormGroup
          label="Recovery code"
          :error="getValidationAttrs('recoveryCode').error"
        >
          <UInput
            v-model="state.recoveryCode"
            @blur="getValidationAttrs('recoveryCode').onBlur"
          />
        </UFormGroup>

        <div v-if="savedKeys?.length" class="pt-2">
          <UDivider />
          <p class="pt-2">Saved keys for the page in this browser</p>
          <div class="pt-2 grid gap-2">
            <div v-for="item in [...savedKeys, ...savedKeys]" class="">
              <div class="inline-flex gap-2">
                <span class="font-medium">Super DM id</span>
                <span>{{ item.superDmId }}</span>
              </div>
              <div class="flex justify-end">
                <UButton
                  :to="toSuperDm(props.pagePath!, item.superDmId)"
                  variant="ghost"
                  >Use <DirectionalArrow
                /></UButton>
              </div>
              <!-- <div class="inline-flex gap-2">
                <span class="font-medium">Recovery code</span>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <UButton variant="ghost" @click="handleHide">Cancel</UButton>
          <UButton @click="handleRecover" :loading="state.loading">
            Recover
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
