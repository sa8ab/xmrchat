<script setup lang="ts">
const colorMode = useColorMode();

const modes: string[] = ["light", "dark", "system"];

const modesIcon: Record<string, string> = {
  system: "i-heroicons-computer-desktop",
  light: "i-heroicons-sun",
  dark: "i-heroicons-moon",
};

const nextMode = computed(() => {
  let nextModeIndex: any = null;

  const currentModeIndex = modes.indexOf(colorMode.preference);

  if (currentModeIndex + 1 == modes.length) {
    nextModeIndex = 0;
  } else {
    nextModeIndex = currentModeIndex + 1;
  }

  return modes[nextModeIndex];
});

const nextModeIcon = computed(() => modesIcon[colorMode.preference]);

const toggleTheme = () => (colorMode.preference = nextMode.value);
</script>

<template>
  <ClientOnly>
    <UButton @click="toggleTheme" color="gray" :icon="nextModeIcon"> </UButton>
  </ClientOnly>
</template>

<style scoped></style>
