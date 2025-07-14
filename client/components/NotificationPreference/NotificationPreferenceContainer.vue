<script setup lang="ts">
import {
  NotificationChannelEnum,
  NotificationPreferenceType,
} from "~/types/enums";

const props = defineProps<{
  channel: NotificationChannelEnum;
}>();

const model = defineModel<{ [key in NotificationPreferenceType]?: boolean }>({
  default: () => ({}),
});

const dailySummaryModel = defineModel<string>("dailySummaryTime");

const { getNotificationChannel, getNotificationType } = useConstants();

const channel = computed(() => getNotificationChannel(props.channel));
const showDailySummaryTime = computed(
  () => props.channel === NotificationChannelEnum.EMAIL
);
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <div class="grid place-items-center">
          <UIcon :name="channel.icon" size="40px" />
        </div>
        <div class="grid">
          <h3 class="text-lg font-bold">{{ channel.name }}</h3>
          <p class="text-xs text-pale">
            {{ channel.description }}
          </p>
        </div>
      </div>
    </template>

    <div class="grid gap-4">
      <div class="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
        <div>
          <UIcon
            :name="getNotificationType(NotificationPreferenceType.NEW_TIP).icon"
            size="20px"
          />
        </div>
        <div class="flex-grow">
          <span>
            {{ getNotificationType(NotificationPreferenceType.NEW_TIP).name }}
          </span>
          <p class="text-pale text-xs">
            {{
              getNotificationType(NotificationPreferenceType.NEW_TIP)
                .description
            }}
          </p>
        </div>
        <div>
          <UToggle v-model="model[NotificationPreferenceType.NEW_TIP]" />
        </div>
      </div>
      <div
        v-if="showDailySummaryTime"
        class="grid grid-cols-[auto_1fr_auto] gap-2 items-center"
      >
        <div>
          <UIcon
            :name="
              getNotificationType(NotificationPreferenceType.DAILY_SUMMARY).icon
            "
            size="20px"
          />
        </div>
        <div class="flex-grow">
          <span>
            {{
              getNotificationType(NotificationPreferenceType.DAILY_SUMMARY).name
            }}
          </span>
          <p class="text-pale text-xs">
            {{
              getNotificationType(NotificationPreferenceType.DAILY_SUMMARY)
                .description
            }}
          </p>
        </div>

        <div>
          <UToggle v-model="model[NotificationPreferenceType.DAILY_SUMMARY]" />
        </div>
        <div></div>
        <UFormGroup name="dailySummaryTime">
          <div class="max-w-[200px]">
            <TimeInput v-model="dailySummaryModel" />
          </div>
          <template #help>
            <p class="text-pale text-xs">
              Time when daily summary notifications will be sent.
            </p>
          </template>
        </UFormGroup>
        <div></div>
      </div>

      <slot />
    </div>
  </UCard>
</template>
