<script setup lang="ts">
import {
  type NotificationChannelEnum,
  NotificationPreferenceType,
} from "~/types/enums";

const props = defineProps<{
  channel: NotificationChannelEnum;
}>();

const model = defineModel<{ [key in NotificationPreferenceType]?: boolean }>({
  required: true,
});

const { getNotificationChannel, getNotificationType } = useConstants();

const channel = computed(() => getNotificationChannel(props.channel));
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
      <div class="flex items-center gap-2">
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
      <div class="flex items-center gap-2">
        <div>
          <UIcon
            :name="
              getNotificationType(NotificationPreferenceType.DAILY_SUMMERY).icon
            "
            size="20px"
          />
        </div>
        <div class="flex-grow">
          <span>
            {{
              getNotificationType(NotificationPreferenceType.DAILY_SUMMERY).name
            }}
          </span>
          <p class="text-pale text-xs">
            {{
              getNotificationType(NotificationPreferenceType.DAILY_SUMMERY)
                .description
            }}
          </p>
        </div>
        <div>
          <UToggle v-model="model[NotificationPreferenceType.DAILY_SUMMERY]" />
        </div>
      </div>
      <slot />
    </div>
  </UCard>
</template>
