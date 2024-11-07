<script lang="ts" setup>
const { confirmEmail } = useServices();
const { toLogin, toIndex } = useRouteLocation();

useHead({ title: "Email Verification" });

const route = useRoute();
const toast = useToast();
const token = computed(() => route.query.token as string);

const state = reactive({
  errorMessage: undefined,
});

const verifyEmail = async () => {
  try {
    await confirmEmail(token.value);
    toast.add({ title: "Your account has been successfully activated" });
    return navigateTo(toLogin()?.path);
  } catch (error) {
    state.errorMessage = getErrorMessage(error);
  }
};

onMounted(() => {
  verifyEmail();
});
</script>

<template>
  <div class="verify">
    <span class="loader" v-if="!state.errorMessage"></span>
    <div v-else class="flex flex-col gap-8 items-center">
      <UAlert
        class="w-[280px]"
        color="red"
        :description="state.errorMessage"
        title="Verification Failed"
      ></UAlert>
      <div>
        <UButton :to="toIndex()">Go To Home Page</UButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.verify {
  @apply flex items-center justify-center w-full min-h-[400px] p-2;
}

.loader {
  width: 16px;
  height: 16px;
  box-shadow: 0 30px, 0 -30px;
  border-radius: 4px;
  background: currentColor;
  display: block;
  margin: -50px auto 0;
  position: relative;
  color: #ff7f0a;
  transform: translateY(30px);
  transform: translateX(-28px);
  box-sizing: border-box;
  animation: animloader 2s ease infinite;
}
.loader::after,
.loader::before {
  content: "";
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  box-shadow: 0 30px, 0 -30px;
  border-radius: 4px;
  background: currentColor;
  color: #ff7f0a;
  position: absolute;
  left: 30px;
  top: 0;
  animation: animloader 2s 0.2s ease infinite;
}
.loader::before {
  animation-delay: 0.4s;
  left: 60px;
}

@keyframes animloader {
  0% {
    top: 0;
    color: #ff7f0a;
  }
  50% {
    top: 30px;
    color: rgba(255, 255, 255, 0.2);
  }
  100% {
    top: 0;
    color: #ff7f0a;
  }
}
</style>
