<script setup>
import { computed } from "vue";
const props = defineProps({
  title: { type: String, required: false, default: "title" },
  description: { type: String, required: false, default: "description" },
  headline: { type: String, required: false },
  image: { type: String, required: false },
});
const {
  public: { imageBaseUrl, imageServerSideBaseUrl },
} = useRuntimeConfig();
const title = computed(() => (props.title || "").slice(0, 60));
const description = computed(() => (props.description || "").slice(0, 200));

const baseUrl = computed(() => imageServerSideBaseUrl || imageBaseUrl);
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center bg-[#fafafa]">
    <svg
      class="absolute right-0 top-0"
      width="629"
      height="593"
      viewBox="0 0 629 593"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_199_94966)">
        <path
          d="M628.5 -578L639.334 -94.4223L806.598 -548.281L659.827 -87.387L965.396 -462.344L676.925 -74.0787L1087.69 -329.501L688.776 -55.9396L1160.22 -164.149L694.095 -34.9354L1175.13 15.7948L692.306 -13.3422L1130.8 190.83L683.602 6.50012L1032.04 341.989L668.927 22.4412L889.557 452.891L649.872 32.7537L718.78 511.519L628.5 36.32L538.22 511.519L607.128 32.7537L367.443 452.891L588.073 22.4412L224.955 341.989L573.398 6.50012L126.198 190.83L564.694 -13.3422L81.8734 15.7948L562.905 -34.9354L96.7839 -164.149L568.224 -55.9396L169.314 -329.501L580.075 -74.0787L291.604 -462.344L597.173 -87.387L450.402 -548.281L617.666 -94.4223L628.5 -578Z"
          fill="#ff7f0a"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_199_94966"
          x="0.873535"
          y="-659"
          width="1255.25"
          height="1251.52"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="40.5"
            result="effect1_foregroundBlur_199_94966"
          />
        </filter>
      </defs>
    </svg>

    <div class="w-[600px] pl-[100px]">
      <p
        v-if="headline"
        class="uppercase text-[24px] text-[#ff7f0a] mb-4 font-semibold"
      >
        {{ headline }}
      </p>
      <h1
        v-if="title"
        class="w-[600px] m-0 text-[75px] font-semibold mb-4 text-black"
        style="display: block; line-clamp: 2; text-overflow: ellipsis"
      >
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="text-[32px] text-[#232323] leading-tight"
        style="display: block; line-clamp: 3; text-overflow: ellipsis"
      >
        {{ description }}
      </p>
    </div>
    <div class="absolute w-[340px] h-[340px] top-[160px] right-[90px]">
      <img
        v-if="image"
        class="absolute top-0 right-0 rounded-full border-[#ff7f0a] border-2 object-cover object-center"
        width="340"
        height="340"
        :src="`${baseUrl}${image}`"
      />
      <div
        class="absolute bottom-0 right-0 w-[120px] h-[120px] bg-[#fafafa] rounded-full p-4 border-[#d1d1d1] border-2"
      >
        <img class="w-full h-full" src="/images/xmrchat-logo.png" alt="" />
      </div>
    </div>
  </div>
</template>
