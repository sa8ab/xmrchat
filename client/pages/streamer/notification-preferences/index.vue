<script setup lang="ts">
import type { NotificationPreference } from "~/types";
import {
  NotificationChannelEnum,
  NotificationPreferenceType,
} from "~/types/enums";

const { axios } = useApp();

type Form = {
  [key in NotificationChannelEnum]: {
    [key in NotificationPreferenceType]?: boolean;
  };
};
interface State {
  form: Form;
}

const state = reactive<State>({
  form: {
    [NotificationChannelEnum.EMAIL]: {},
  },
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
</script>

<template>
  <div>
    <PageTitle
      title="Notification Preferences"
      description="Manage your notification preferences"
    />
    <div class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
      <NotificationPreferenceContainer
        :channel="NotificationChannelEnum.EMAIL"
        v-model="state.form.email"
      >
      </NotificationPreferenceContainer>
    </div>
  </div>
</template>

<style scoped></style>
