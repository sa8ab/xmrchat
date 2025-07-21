import type { IntegrationConfig } from "~/types";
import { IntegrationConfigType } from "~/types/enums";

interface Params {
  integrations?: MaybeRef<IntegrationConfig[] | undefined>;
}

export const useIntegrations = (params: Params) => {
  const integrations = unref(params.integrations);

  const getIntegration = (type: IntegrationConfigType, method: string) =>
    integrations?.find((i) => i.type === type && i.method === method);

  const simplex = computed(() =>
    getIntegration(IntegrationConfigType.SIMPLEX, "code")
  );
  const signal = computed(() =>
    getIntegration(IntegrationConfigType.SIGNAL, "code")
  );

  return {
    getIntegration,
    simplex,
    signal,
  };
};
