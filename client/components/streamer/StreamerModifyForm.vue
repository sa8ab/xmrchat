<script lang="ts" setup>
// @ts-ignore
import debounce from "lodash.debounce";
import useVuelidate from "@vuelidate/core";
import type { CreateFormFields, SlugReservationResponse } from "~/types";

const { toStreamerDisplay, toGuides } = useRouteLocation();

interface State {
  form: CreateFormFields;
  loadingSlug: boolean;
  slugAvailable: boolean;
  loading: boolean;
  errorMessage?: string;

  stagedLogo?: string;
  stagedBanner?: string;
}
const toast = useToast();
const { required, minLength, maxLength, streamerSlug, streamerSlugInternal } =
  useValidations();
const {
  checkSlug: checkSlugApi,
  reserveSlug,
  getMyPage,
  updateStreamer,
} = useServices();

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

const state = reactive<State>({
  form: {
    adult: false,
    logo: undefined,
    cover_image: undefined,
    payment_address: undefined,
    view_key: undefined,
    slug: undefined,
    tiers: [],
    twitch_channel: undefined,
  },
  slugAvailable: false,
  loadingSlug: false,
  loading: false,
  errorMessage: undefined,

  stagedBanner: undefined,
  stagedLogo: undefined,
});

const renderSlugStatus = computed(() => {
  if (v.value.slug.$invalid || props.editable) return undefined;
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
  const showUrl = !v.value.slug.$invalid;
  if (showUrl)
    return `Your page will be available at xmrchat.com/${state.form.slug}`;
  return undefined;
});

const chechSlugDebounced = debounce(async (value: string | undefined) => {
  if (v.value.slug.$invalid || props.editable) return;
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
  () => state.form.slug,
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
        slug: state.form.slug,
      });
    } else {
      if (!state.form.slug) return;
      const res = await updateStreamer(state.form.slug, {
        adult: state.form.adult,
        logo: state.form.logo,
        cover_image: state.form.cover_image,
        payment_address: state.form.payment_address,
        view_key: state.form.view_key,
        tiers: state.form.tiers,
        twitch_channel: state.form.twitch_channel,
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
    cover_image: { required },
    payment_address: {
      required,
      minLength: minLength(95),
      maxLength: maxLength(106),
    },
    view_key: { required, minLength: minLength(64), maxLength: maxLength(64) },
    slug: {
      required,
      streamerSlug,
      streamerSlugInternal,
      minLength: minLength(3),
      maxLength: maxLength(16),
    },
  },
  toRef(state, "form")
);

const getPage = async () => {
  if (props.editable) {
    const response = await getMyPage();
    state.form = {
      adult: response.adult,
      logo: response.logo,
      cover_image: response.cover_image,
      payment_address: response.payment_address,
      view_key: response.view_key,
      slug: response.path,
      twitch_channel: response.twitch_channel,
      tiers:
        response.tiers?.map((tier) => ({
          name: tier.name,
          price: tier.amount,
        })) || [],
    };
  }
};

onMounted(async () => {
  getPage();
});

const { getValidationAttrs } = useValidations(v);
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
                v-if="state.form.logo"
                :id="state.form.logo"
                variant="logo"
                class="w-[200px] h-[200px]"
              />
            </div>
            <ImageUploader
              @upload="state.form.logo = $event"
              @blur="getValidationAttrs('logo').onBlur"
            />
          </div>
        </UFormGroup>

        <UFormGroup
          size="lg"
          label="Banner Image"
          description="Best to be uploaded in 3:1"
          name="cover_image"
          :error="getValidationAttrs('cover_image').error"
        >
          <div class="flex flex-col gap-2">
            <div class="flex justify-center">
              <GeneralImage
                v-if="state.form.cover_image"
                :id="state.form.cover_image"
                variant="banner"
                class="w-full h-[200px]"
              />
            </div>
            <ImageUploader
              @upload="state.form.cover_image = $event"
              @blur="getValidationAttrs('cover_image').onBlur"
            />
          </div>
        </UFormGroup>
      </div>

      <div class="single">
        <UFormGroup
          size="lg"
          label="Your Id"
          name="slug"
          :error="getValidationAttrs('slug').error"
          :description="renderResultURL"
        >
          <UInput
            :disabled="editable"
            placeholder="Page Slug"
            v-model="state.form.slug"
            @blur="getValidationAttrs('slug').onBlur"
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
          :error="getValidationAttrs('payment_address').error"
        >
          <UInput
            type="text"
            v-model="state.form.payment_address"
            @blur="getValidationAttrs('payment_address').onBlur"
          />
        </UFormGroup>

        <UFormGroup
          size="lg"
          label="Monero secret view key"
          name="view_key"
          :error="getValidationAttrs('view_key').error"
        >
          <UInput
            v-model="state.form.view_key"
            @blur="getValidationAttrs('view_key').onBlur"
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
          help="Lowercase name of your twitch channel. Used to inform tips via xmr_chat twitch bot."
        >
          <UInput v-model="state.form.twitch_channel" />
        </UFormGroup>
      </div>

      <div class="single">
        <UFormGroup label="Tip Amount Suggestions">
          <StreamerTipSuggestions v-model="state.form.tiers" />
        </UFormGroup>
        <!-- <UFormGroup size="lg" label="Set minimum XMR tip amount">
          <UInput type="number" />
        </UFormGroup> -->
      </div>

      <div class="mt-8">
        <UCheckbox
          color="primary"
          label="Check if adult content"
          v-model="state.form.adult"
        />
      </div>

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
