<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
});

const model = defineModel<string>();

// Generate hours (0-23)
const hours = computed(() => {
  return Array.from({ length: 24 }, (_, i) => ({
    name: i.toString().padStart(2, "0"),
    value: i.toString().padStart(2, "0"),
  }));
});

// Generate minutes in 5-minute intervals (0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55)
const minutes = computed(() => {
  return Array.from({ length: 12 }, (_, i) => ({
    name: (i * 5).toString().padStart(2, "0"),
    value: (i * 5).toString().padStart(2, "0"),
  }));
});

// Parse the current time value
const currentTime = computed(() => {
  if (!model.value) return { hour: "00", minute: "00" };

  const [hour, minute] = model.value.split(":");
  return {
    hour: hour || "00",
    minute: minute || "00",
  };
});

// Update the model when hour or minute changes
const selectedHour = computed({
  get: () => currentTime.value.hour,
  set: (value: string) => {
    model.value = `${value}:${currentTime.value.minute}`;
  },
});

const selectedMinute = computed({
  get: () => currentTime.value.minute,
  set: (value: string) => {
    model.value = `${currentTime.value.hour}:${value}`;
  },
});
</script>

<template>
  <div class="flex gap-2">
    <USelectMenu
      v-model="selectedHour"
      :options="hours"
      valueAttribute="value"
      optionAttribute="name"
      placeholder="Hour"
      class="flex-1"
      v-bind="$attrs"
    />
    <span class="flex items-center text-pale">:</span>
    <USelectMenu
      v-model="selectedMinute"
      :options="minutes"
      valueAttribute="value"
      optionAttribute="name"
      placeholder="Minute"
      class="flex-1"
      v-bind="$attrs"
    />
  </div>
</template>

<style scoped></style>
