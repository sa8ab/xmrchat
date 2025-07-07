<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { NotificationPreference, Numberic } from "~/types";
import {
  NotificationChannelEnum,
  NotificationPreferenceType,
} from "~/types/enums";

const { axios } = useApp();
const toast = useToast();
const { numberic } = useValidations();
const authStore = useAuthStore();

type Form = {
  [key in NotificationChannelEnum]: {
    [key in NotificationPreferenceType]?: boolean;
  };
};
interface State {
  form: Form;
  pending: boolean;
  minNotificationThreshold?: Numberic;
}

const state = reactive<State>({
  form: {
    [NotificationChannelEnum.EMAIL]: {},
  },
  pending: false,
  minNotificationThreshold: undefined,
});

const getObjectPereferences = (
  channel: NotificationChannelEnum,
  list: NotificationPreference[]
) => {
  return list
    .filter((p) => p.channel === channel)
    .reduce((acc, curr) => {
      acc[curr.type] = curr.enabled;
      return acc;
    }, {} as Form[NotificationChannelEnum]);
};

const { error } = await useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{
      preferences: NotificationPreference[];
      minNotificationThreshold: number;
    }>(`/notification-preferences`);

    state.form.email = getObjectPereferences(
      NotificationChannelEnum.EMAIL,
      data.preferences
    );

    state.minNotificationThreshold = data.minNotificationThreshold;
  },
  { server: false }
);

const handleSave = async () => {
  const convertedPreferences = Object.entries(state.form)
    .map(([channel, p]) => {
      return Object.entries(p).map(([type, enabled]) => {
        return {
          channel,
          type,
          enabled,
        };
      });
    })
    .flatMap((p) => p);

  state.pending = true;
  try {
    await axios.patch("/notification-preferences", {
      preferences: convertedPreferences,
      minNotificationThreshold: state.minNotificationThreshold
        ? parseFloat(state.minNotificationThreshold as string)
        : null,
    });
    toast.add({
      color: "green",
      title: "Notification preferences saved.",
    });
  } catch (error) {
    toast.add({
      color: "red",
      title: getErrorMessage(error),
    });
  } finally {
    state.pending = false;
  }
};

const v = useVuelidate<any>(
  {
    minNotificationThreshold: { numberic },
  },
  state
);

const { getValidationAttrs } = useValidations(v);

const isPremium = computed(
  () => authStore.state.user?.isPremium || authStore.isAdmin
);
</script>

<template>
  <div>
    <PageTitle title="Notifications" description="Manage your notifications" />
    <div class="text-center" v-if="!isPremium">
      <p class="text-2xl font-bold">Coming Soon</p>
      <p class="mt-2">This feature will be available soon.</p>
    </div>

    <ErrorView :error="error" v-else-if="error" />

    <GeneralForm @submit="handleSave" v-else>
      <div class="grid mb-10 grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup
          label="Min Notification Threshold"
          name="minNotificationThreshold"
          :error="getValidationAttrs('minNotificationThreshold').error"
          help="The minimum amount of XMR tip that will trigger a notification."
        >
          <UInput
            v-model="state.minNotificationThreshold"
            @blur="getValidationAttrs('minNotificationThreshold').onBlur"
            :style="{ paddingStart: '54px' }"
          >
            <template #leading>
              <span
                class="text-pale flex items-center text-center justify-center"
              >
                XMR
              </span>
            </template>
          </UInput>
        </UFormGroup>
      </div>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        <NotificationPreferenceContainer
          :channel="NotificationChannelEnum.EMAIL"
          v-model="state.form.email"
        >
        </NotificationPreferenceContainer>
      </div>
      <div class="flex mt-4">
        <UButton type="submit" color="primary" :loading="state.pending">
          {{ $t("saveChanges") }}
        </UButton>
      </div>
    </GeneralForm>
  </div>
</template>

<style scoped></style>
