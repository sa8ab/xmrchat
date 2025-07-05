<script setup lang="ts">
import type { NotificationPreference } from "~/types";
import {
  NotificationChannelEnum,
  NotificationPreferenceType,
} from "~/types/enums";

const { axios } = useApp();
const toast = useToast();

type Form = {
  [key in NotificationChannelEnum]: {
    [key in NotificationPreferenceType]?: boolean;
  };
};
interface State {
  form: Form;
  pending: boolean;
}

const state = reactive<State>({
  form: {
    [NotificationChannelEnum.EMAIL]: {},
  },
  pending: false,
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

await useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ preferences: NotificationPreference[] }>(
      `/notification-preferences`
    );

    state.form.email = getObjectPereferences(
      NotificationChannelEnum.EMAIL,
      data.preferences
    );
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
</script>

<template>
  <div>
    <PageTitle title="Notifications" description="Manage your notifications" />
    <GeneralForm @submit="handleSave">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        <NotificationPreferenceContainer
          :channel="NotificationChannelEnum.EMAIL"
          v-model="state.form.email"
        >
        </NotificationPreferenceContainer>
      </div>
      <div class="flex mt-4">
        <UButton type="submit" color="primary" :loading="state.pending">
          Save
        </UButton>
      </div>
    </GeneralForm>
  </div>
</template>

<style scoped></style>
