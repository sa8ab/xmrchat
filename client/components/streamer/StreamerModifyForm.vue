<script lang="ts" setup>
// @ts-ignore
import debounce from "lodash.debounce";
import useVuelidate from "@vuelidate/core";
import type {
  CreateFormFields,
  SlugReservationResponse,
  UploadedFile,
} from "~/types";

const { toStreamerDisplay, toGuides } = useRouteLocation();

interface State {
  form: CreateFormFields;
  loadingSlug: boolean;
  slugAvailable: boolean;
  loading: boolean;
  errorMessage?: string;

  stagedLogoUrl?: string;
  stagedBannerUrl?: string;
}

const emit = defineEmits<{
  done: [
    {
      data: SlugReservationResponse;
      slug?: string;
    }
  ];
}>();

const props = defineProps<{
  editable: boolean;
}>();

const toast = useToast();
const {
  required,
  minLength,
  maxLength,
  streamerSlug,
  streamerSlugInternal,
  numberic,
  minValue,
} = useValidations();

const { minXMRPayAmount } = useAppConfig();

const {
  checkSlug: checkSlugApi,
  reserveSlug,
  getMyPage,
  updateStreamer,
} = useServices();

const { minUsdAmount } = useXmrPrice();

const state = reactive<State>({
  form: {
    logo: undefined,
    coverImage: undefined,
    primaryAddress: undefined,
    secretViewKey: undefined,
    path: undefined,
    tiers: [],
    twitchChannel: undefined,
    isPublic: true,
  },
  slugAvailable: false,
  loadingSlug: false,
  loading: false,
  errorMessage: undefined,

  stagedBannerUrl: undefined,
  stagedLogoUrl: undefined,
});

const renderSlugStatus = computed(() => {
  if (v.value.path.$invalid || props.editable) return undefined;
  if (state.loadingSlug)
    return {
      text: "Loading",
      className: "",
    };
  if (state.slugAvailable)
    return {
      text: "Available",
      className: "text-green-500",
    };
  return {
    text: "Unavailable",
    className: "text-red-500",
  };
});

const isSlugValid = computed(() => state.slugAvailable && !state.loadingSlug);

const renderResultURL = computed(() => {
  const showUrl = !v.value.path.$invalid;
  if (showUrl)
    return `Your page will be available at xmrchat.com/${state.form.path}`;
  return undefined;
});

const chechSlugDebounced = debounce(async (value: string | undefined) => {
  if (v.value.path.$invalid || props.editable) return;
  state.loadingSlug = true;
  try {
    const res = await checkSlugApi({
      slug: value,
    });
    state.slugAvailable = res.available;
  } catch (error) {
    console.log("error");
  } finally {
    state.loadingSlug = false;
  }
}, 500);

watch(
  () => state.form.path,
  (v) => chechSlugDebounced(v)
);

const handleSubmit = async () => {
  v.value.$touch();
  const valid = await v.value.$validate();
  if (!valid) return;

  state.errorMessage = undefined;
  try {
    state.loading = true;

    if (!props.editable) {
      if (!isSlugValid.value) return;
      const res = await reserveSlug(state.form);
      emit("done", {
        data: res,
        slug: state.form.path,
      });
    } else {
      if (!state.form.path) return;
      const res = await updateStreamer(state.form.path, {
        logo: state.form.logo,
        coverImage: state.form.coverImage,
        primaryAddress: state.form.primaryAddress,
        secretViewKey: state.form.secretViewKey,
        tiers: state.form.tiers,
        twitchChannel: state.form.twitchChannel?.toLowerCase(),
        isPublic: state.form.isPublic,
        minTipAmount: state.form.minTipAmount?.toString() || null,
      });
      toast.add({ title: "Page updated!" });
      navigateTo(toStreamerDisplay()?.path);
    }
  } catch (error) {
    state.errorMessage = getErrorMessage(error);
  } finally {
    state.loading = false;
  }
};

// Vuelidatte Validation Parameteres
const v = useVuelidate<State["form"]>(
  {
    logo: { required },
    coverImage: { required },
    primaryAddress: {
      required,
      minLength: minLength(95),
      maxLength: maxLength(106),
    },
    secretViewKey: {
      required,
      minLength: minLength(64),
      maxLength: maxLength(64),
    },
    path: {
      required,
      streamerSlug,
      streamerSlugInternal,
      minLength: minLength(3),
      maxLength: maxLength(16),
    },
    minTipAmount: { numberic, minValue: minValue(minXMRPayAmount) },
  },
  toRef(state, "form")
);

const getPage = async () => {
  if (!props.editable) return;

  const response = await getMyPage();
  const page = response.page;
  if (!page) return;

  state.form = {
    logo: page.logo.id,
    coverImage: page.coverImage.id,
    primaryAddress: page.primaryAddress,
    secretViewKey: page.secretViewKey,
    path: page.path,
    twitchChannel: page.twitchChannel?.toLowerCase(),
    isPublic: page.isPublic,
    minTipAmount: page.minTipAmount,
    tiers: page.tiers || [],
  };

  state.stagedLogoUrl = page.logo.url;
  state.stagedBannerUrl = page.coverImage.url;
};

onMounted(async () => {
  getPage();
});

const { getValidationAttrs } = useValidations(v);
const handleLogoUpload = (file: UploadedFile) => {
  state.stagedLogoUrl = file.url;
  state.form.logo = file.id;
};
const handleBannerUpload = (file: UploadedFile) => {
  state.stagedBannerUrl = file.url;
  state.form.coverImage = file.id;
};
</script>

<template>
  <div>
    <UForm
      :state="state.form"
      class="create-modify-form inner"
      @submit="handleSubmit"
    >
      <div class="both">
        <UFormGroup
          size="lg"
          label="Logo"
          description="1:1 ratio"
          name="logo"
          :error="getValidationAttrs('logo').error"
        >
          <div class="flex flex-col gap-2">
            <div class="flex justify-center">
              <GeneralImage
                v-if="state.stagedLogoUrl"
                :url="state.stagedLogoUrl"
                variant="logo"
                class="w-[200px] h-[200px]"
              />
            </div>
            <ImageUploader
              @upload="handleLogoUpload"
              @blur="getValidationAttrs('logo').onBlur"
            />
          </div>
        </UFormGroup>

        <UFormGroup
          size="lg"
          label="Banner Image"
          description="Best to be uploaded in 3:1"
          name="cover_image"
          :error="getValidationAttrs('coverImage').error"
        >
          <div class="flex flex-col gap-2">
            <div class="flex justify-center">
              <GeneralImage
                v-if="state.stagedBannerUrl"
                :url="state.stagedBannerUrl"
                variant="banner"
                class="w-full h-[200px]"
              />
            </div>
            <ImageUploader
              @upload="handleBannerUpload"
              @blur="getValidationAttrs('coverImage').onBlur"
            />
          </div>
        </UFormGroup>
      </div>

      <div class="single">
        <UFormGroup
          size="lg"
          label="Your Id"
          name="slug"
          :error="getValidationAttrs('path').error"
          :description="renderResultURL"
        >
          <UInput
            :disabled="editable"
            placeholder="Page Slug"
            v-model="state.form.path"
            @blur="getValidationAttrs('path').onBlur"
          />
        </UFormGroup>
        <span
          v-if="renderSlugStatus"
          :class="['text-sm flex pt-2', renderSlugStatus.className]"
        >
          {{ renderSlugStatus.text }}
        </span>
      </div>

      <div class="both">
        <UFormGroup
          size="lg"
          label="Monero primary receive address"
          name="payment_address"
          :error="getValidationAttrs('primaryAddress').error"
          help="Primary Monero receive addresses begin with the number 4."
        >
          <UInput
            type="text"
            v-model="state.form.primaryAddress"
            @blur="getValidationAttrs('primaryAddress').onBlur"
          />
        </UFormGroup>

        <UFormGroup
          size="lg"
          label="Monero secret view key"
          name="view_key"
          :error="getValidationAttrs('secretViewKey').error"
        >
          <UInput
            v-model="state.form.secretViewKey"
            @blur="getValidationAttrs('secretViewKey').onBlur"
          />
          <template #help>
            <span>
              We need secret view key to be able to view incoming transactions
              from viewers.
            </span>
            <UButton
              variant="link"
              color="blue"
              target="_blank"
              class="p-0"
              :to="toGuides()"
            >
              Where to find view key?
            </UButton>
          </template>
        </UFormGroup>
      </div>

      <div class="both">
        <UFormGroup
          size="lg"
          label="Twitch channel name"
          name="twitch_channel"
          hint="Optional"
          help="Name of your twitch channel. Used to display tips on Stream via xmr_chat Twitch bot."
        >
          <UInput v-model="state.form.twitchChannel" />
        </UFormGroup>
        <UFormGroup
          v-if="editable"
          size="lg"
          label="Min. Tip Amount ( XMR )"
          :hint="`Default: ${minXMRPayAmount} XMR`"
          help=""
          :error="getValidationAttrs('minTipAmount').error"
        >
          <UInput
            v-model="state.form.minTipAmount"
            @blur="getValidationAttrs('minTipAmount').onBlur"
          />
        </UFormGroup>
      </div>

      <div class="single" v-if="editable">
        <UFormGroup label="Tip Amount Suggestions">
          <StreamerTipSuggestions
            v-model="state.form.tiers"
            :minUsdAmount="minUsdAmount"
          />
        </UFormGroup>
        <!-- <UFormGroup size="lg" label="Set minimum XMR tip amount">
          <UInput type="number" />
        </UFormGroup> -->
      </div>

      <!-- <div class="mt-8">
        <UCheckbox
          color="primary"
          label="Check if adult content"
          v-model="state.form.adult"
        />
      </div> -->
      <UCheckbox
        color="primary"
        label="Public Page ( Shown on creator search page )."
        v-model="state.form.isPublic"
      />

      <div class="single">
        <UAlert
          color="red"
          :description="state.errorMessage"
          title="Error creating/updating page"
          v-if="state.errorMessage"
        >
        </UAlert>
      </div>

      <div class="flex gap-3">
        <UButton
          size="lg"
          type="submit"
          :loading="state.loading"
          trailingIcon="i-heroicons-arrow-small-right"
        >
          Continue
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<style scoped lang="scss">
.create-modify-form {
  @apply flex gap-6 flex-col max-w-[860px];
  .both {
    .buttons {
      @apply inline-flex gap-2;
    }

    .banner {
      @apply flex justify-center mb-8;
      img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
    }
  }
}
</style>
