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

const renderText = computed(() => {
  if (nextMode.value === "light") return "switch to light mode";
  if (nextMode.value === "dark") return "switch to dark mode";
  if (nextMode.value === "system") return "switch to system default theme";
});
</script>

<template>
  <ClientOnly>
    <UButton @click="toggleTheme" color="gray" square :icon="nextModeIcon">
      <span class="sr-only">{{ renderText }}</span>
    </UButton>
  </ClientOnly>
</template>

<style scoped></style>
