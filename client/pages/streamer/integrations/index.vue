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
const { dayjs } = useDate();

interface State {
  // form: Form;
  pending: boolean;
}

const state = reactive<State>({
  pending: false,
});

const v = useVuelidate<any>({}, state);

const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <div>
    <PageTitle title="Notifications" description="Manage your notifications" />

    <!-- <ErrorView :error="error" v-if="error" /> -->
  </div>
</template>

<style scoped></style>
