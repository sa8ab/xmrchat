import type { Validation } from "@vuelidate/core";
import {
  required as baseRequired,
  email as baseEmail,
  numeric as baseNumberic,
  minValue as baseMinValue,
  minLength as baseMinLength,
  maxLength as baseMaxLength,
  sameAs as baseSameAs,
  url as baseUrl,
  helpers,
} from "@vuelidate/validators";
// import { getProperty } from "~/utils";

export const useValidations = (generalV?: Ref<Validation>) => {
  const { t } = useI18n();
  const required = helpers.withMessage(
    () => t("validations.required"),
    baseRequired
  );
  const email = helpers.withMessage(() => t("validations.email"), baseEmail);
  const numberic = helpers.withMessage(
    () => t("validations.numberic"),
    baseNumberic
  );

  const url = helpers.withMessage(() => t("validations.url"), baseUrl);
  const notUrl = helpers.withMessage(
    () => t("validations.notUrl"),
    (...params) => (params[0] ? !baseUrl.$validator(...params) : true)
  );

  const minLength = (...v: Parameters<typeof baseMinLength>) =>
    helpers.withMessage(
      ({ $params }) => t("validations.minLength", { length: $params.min }),
      baseMinLength(...v)
    );

  const maxLength = (...v: Parameters<typeof baseMinLength>) =>
    helpers.withMessage(
      ({ $params }) => t("validations.maxLength", { length: $params.max }),
      baseMaxLength(...v)
    );

  const minValue = (...v: Parameters<typeof baseMinValue>) =>
    helpers.withMessage(
      ({ $params }) => t("validations.minValue", { value: $params.min }),
      baseMinValue(...v)
    );

  const sameAs = (...v: Parameters<typeof baseSameAs>) =>
    helpers.withMessage(
      ({ $params }) =>
        t("validations.sameAs", { otherName: $params.otherName }),
      baseSameAs(...v)
    );

  const streamerSlugBase = helpers.regex(/^[a-z0-9_-]+$/);

  const streamerSlug = helpers.withMessage(
    "Your path can only contain lowercase letters, numbers, underscores, and hyphens.",
    streamerSlugBase
  );

  const moneroPrimaryAddressBase = (v: any) =>
    typeof v === "string" && v.startsWith("4");

  const moneroPrimaryAddress = helpers.withMessage(
    "Primary address is invalid. It should start with 4.",
    moneroPrimaryAddressBase
  );

  const streamerSlugInternalBase = (v: string) =>
    ![
      "auth",
      "guides",
      "streamer",
      "contact",
      "creator",
      "creators",
      "subscribe",
      "subscription",
      "subscriptions",
    ].includes(v);

  const streamerSlugInternal = helpers.withMessage(
    "This slug is not usable.",
    streamerSlugInternalBase
  );

  const getValidationAttrs = (path: string, v?: MaybeRef<Validation>) => {
    v = unref(v || generalV);
    const instance = getProperty(v, path);

    return {
      onBlur: instance.$touch,
      error: instance.$errors[0]?.$message,
    };
  };

  const validate = async (v?: MaybeRef<Validation>) => {
    v = unref(v || generalV);
    if (!v) return;

    v.$touch();
    await v.$validate();
    return v.$errors.map((error: any) => ({
      message: error.$message,
      path: error.$propertyPath,
    })) as any;
  };

  return {
    required,
    email,
    numberic,
    minLength,
    maxLength,
    minValue,
    sameAs,
    url,
    notUrl,
    streamerSlug,
    streamerSlugInternal,
    moneroPrimaryAddress,
    getValidationAttrs,
    validate,
  };
};
