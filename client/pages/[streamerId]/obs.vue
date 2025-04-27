<script lang="ts" setup>
import type { ObsTipSocketEvent, Tip } from "~/types";
import gsap from "gsap";
import { PageSettingKey } from "~/types/enums";

definePageMeta({
  layout: "blank",
});

const route = useRoute();
const slug = computed(() => route.params.streamerId as string);

const { getPageOBSSettings: getSettings } = useServices();

const { data, pending } = useLazyAsyncData(
  `obs-settings-${slug.value}`,
  () => getSettings(slug.value),
  {
    transform: (data) => {
      const settings = data.settings;

      const keepMessages =
        settings.find(({ key }) => key === PageSettingKey.OBS_KEEP_MESSAGES)
          ?.value ?? false;
      const playSound =
        settings.find(({ key }) => key === PageSettingKey.OBS_PLAY_SOUND)
          ?.value ?? false;

      return {
        keepMessages,
        playSound,
      };
    },
    server: false,
  }
);

const { init, disconnect } = usePageSocket({
  handleObsTipEvent: (data) => {
    if (tips.value.some((t) => t.tip?.id === data.tip.id)) return;

    tips.value.unshift(data);
    handleAfterTip({ id: data.tip.id, autoRemove: data.autoRemove });
  },
  handleObsTipRemovalEvent: (data) => {
    removeTip(data.tipId);
  },
});

// const { init, disconnect } = usePaymentSocket<ObsTipSocketMessage>({
//   onPageTipEvent: (e) => {
//     const id = Math.random().toString();

//     tips.value.unshift({
//       amount: e.amount, // amount is string units, update before using
//       name: e.name,
//       message: e.message,
//       id,
//     });

//     handleAfterTip(id);
//   },
// });

onMounted(() => {
  init(slug.value);
});

onBeforeUnmount(() => disconnect());

const tips = ref<ObsTipSocketEvent[]>([]);

const simulateTip = () => {
  // confetti("tsparticles", {
  //   position: {
  //     x: 50,
  //     y: 100,
  //   },
  //   count: 100,
  // });

  const id = Math.random();
  tips.value.unshift({
    autoRemove: true,
    message:
      "Tipperio tipped 12$: Hey let's try playing Post Rock, I don't really wanna listen to any I didn't know what to put here tbh with you.",
  });

  handleAfterTip({ id, autoRemove: true });
};

const handleAfterTip = (params: { id: number; autoRemove?: boolean }) => {
  if (!params.autoRemove) return;
  playSound();
  setTimeout(() => {
    removeTip(params.id);
  }, 60 * 1000);
};

const removeTip = (id: number) => {
  tips.value = tips.value.filter((t) => t.tip?.id !== id);
};

const playSound = () => {
  if (!data.value?.playSound) return;

  const audio = new Audio("/sounds/obs-sound-1.mp3");

  audio.play();
};

const onBeforeEnter = (el: Element) => {
  gsap.set(el, {
    scale: 0.8,
    opacity: 0,
    height: 0,
  });
};

const onEnter = (el: Element, done: () => void) => {
  gsap.to(el, {
    scale: 1,
    duration: 1,
    ease: "elastic.out(1,0.4)",
    onComplete: done,
  });

  gsap.to(el, {
    opacity: 1,
    height: "auto",
    duration: 0.2,
    ease: "power4.out",
  });
};

const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,

    ease: "power4.out",
    onComplete: done,
  });
};
</script>

<template>
  <DevOnly>
    <UButton class="fixed top-10 z-50" @click="simulateTip">
      Simulate new message
    </UButton>
  </DevOnly>
  <div class="obs-page h-screen relative flex flex-col-reverse overflow-auto">
    <div class="messages w-full flex flex-col-reverse absolute gap-8 p-1 px-8">
      <TransitionGroup
        :css="false"
        @beforeEnter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
      >
        <div v-for="item in tips" :key="item.tip?.id">
          <ObsMessage :event="item" />
        </div>
      </TransitionGroup>
    </div>
    <div id="tsparticles"></div>
  </div>
</template>

<style scoped></style>
