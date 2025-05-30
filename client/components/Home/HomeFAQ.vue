<script lang="ts" setup>
const { t } = useI18n();

const items = computed(() => [
  {
    label: t("FAQ.whyTipWithXMRChat"),
    defaultOpen: true,
    slot: "one",
  },
  {
    label: t("FAQ.howToUseXMRChat"),
    slot: "two",
  },
  {
    label: t("FAQ.whyUseMonero"),
    slot: "three",
  },
  {
    label: t("FAQ.whereToGetMonero"),
    slot: "four",
  },
]);

const linkProps = { padded: false, target: "_blank", variant: "link" } as any; // UButton does not export props I guess
</script>

<template>
  <div class="mt-7">
    <h3 class="w-full text-center text-4xl font-bold">{{ t("FAQ.title") }}</h3>
    <div class="mt-10 flex justify-center">
      <UAccordion
        class="max-w-[1024px]"
        :items="items"
        variant="ghost"
        color="gray"
      >
        <template #default="{ item, open }">
          <UButton variant="solid" color="gray" class="mb-2" size="lg" icon="">
            <span class="flex-1 text-start">
              {{ item.label }}
            </span>
            <template #trailing>
              <DirectionalArrow
                type="chevron"
                :class="[
                  'transform transition-transform duration-200',
                  open && 'rotate-90',
                ]"
              />
            </template>
          </UButton>
        </template>
        <template #one>
          <ul class="list">
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>{{ t("earnMore.title") }}</span>
              </div>
              <p>
                {{ t("earnMore.description") }}
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>{{ t("censorshipResistant.title") }}</span>
              </div>
              <p>
                {{ t("censorshipResistant.description") }}
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>{{ t("corruptionResistant.title") }}</span>
              </div>
              <p>
                {{ t("corruptionResistant.description") }}
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>{{ t("private.title") }}</span>
              </div>
              <p>
                {{ t("private.description") }}
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>{{ t("quickAndEasy.title") }}</span>
              </div>
              <p>
                {{ t("quickAndEasy.description") }}
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>{{ t("openSource.title") }}</span>
              </div>
              <p>
                <I18nT keypath="openSource.description">
                  <template #github>
                    <UButton
                      to="https://github.com/sa8ab/xmrchat"
                      v-bind="linkProps"
                    >
                      {{ t("here") }}</UButton
                    >
                  </template>
                </I18nT>
              </p>
            </li>
          </ul>
        </template>
        <template #two>
          <UAccordion
            class="max-w-[1024px]"
            variant="ghost"
            color="gray"
            :items="[
              { label: $t('forContentCreators.title'), slot: 'one' },
              { label: $t('forFans.title'), slot: 'two' },
            ]"
          >
            <template #default="{ item, open }">
              <UButton class="mb-2" size="lg" variant="outline">
                <span class="flex-1 text-start">
                  {{ item.label }}
                </span>
                <template #trailing>
                  <DirectionalArrow
                    type="chevron"
                    :class="[
                      'transform transition-transform duration-200',
                      open && 'rotate-90',
                    ]"
                  />
                </template>
              </UButton>
            </template>
            <template #one>
              <div class="">
                <p>
                  {{ $t("forContentCreators.description.main") }}
                </p>
                <p>
                  {{ $t("forContentCreators.description.ifUseStreamyard") }}
                </p>
                <p>
                  {{ $t("forContentCreators.description.ifUseOBS") }}
                </p>
                <p>
                  {{ $t("forContentCreators.description.ifOnlyYouTube") }}
                </p>
              </div>
            </template>

            <template #two>
              <div>
                <p>{{ $t("forFans.description") }}</p>
              </div>
            </template>
          </UAccordion>
        </template>
        <template #three>
          <ul class="list">
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>{{ t("lowFees.title") }}</span>
              </div>
              <p>{{ t("lowFees.description") }}</p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>{{ t("privateMonero.title") }}</span>
              </div>
              <p>
                {{ t("privateMonero.description") }}
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>{{ t("accepted.title") }}</span>
              </div>
              <p>
                <I18nT keypath="accepted.description">
                  <template #xmrbazaar>
                    <UButton to="https://xmrbazaar.com" v-bind="linkProps">
                      xmrbazaar.com
                    </UButton>
                  </template>

                  <template #monerica>
                    <UButton to="https://monerica.com" v-bind="linkProps">
                      monerica.com
                    </UButton>
                  </template>
                </I18nT>
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>{{ t("andMore.title") }}</span>
              </div>
              <p>
                <I18nT keypath="andMore.description">
                  <template #getmonero>
                    <UButton to="https://getmonero.org" v-bind="linkProps">
                      getmonero.org
                    </UButton>
                  </template>
                  <template #moneroeco>
                    <UButton to="https://monero.eco" v-bind="linkProps">
                      monero.eco
                    </UButton>
                  </template>
                </I18nT>
              </p>
            </li>
          </ul>
        </template>
        <template #four>
          <ul class="list">
            <li>
              <p>
                <I18nT keypath="whereToGetMonero.cakeWallet">
                  <template #cakeWallet>
                    <UButton to="https://cakewallet.com" v-bind="linkProps">
                      Cake Wallet
                    </UButton>
                  </template>
                </I18nT>
              </p>
            </li>
            <li>
              <p>
                <I18nT keypath="whereToGetMonero.stealthex">
                  <template #stealthex>
                    <UButton to="https://stealthex.io" v-bind="linkProps">
                      stealthex.io
                    </UButton>
                  </template>
                  <template #kycnot>
                    <UButton
                      to="https://kycnot.me/?t=exchange&q=&xmr=on"
                      v-bind="linkProps"
                    >
                      kycnot.me</UButton
                    >
                  </template>
                </I18nT>
              </p>
            </li>
            <li>
              <p>
                <I18nT keypath="whereToGetMonero.haveno">
                  <template #haveno>
                    <UButton to="https://haveno-reto.com/" v-bind="linkProps">
                      haveno-reto.com
                    </UButton>
                  </template>
                  <template #blog>
                    <UButton
                      to="https://blog.nihilism.network/servers/haveno-cashbymail/index.html"
                      v-bind="linkProps"
                      >{{ t("whereToGetMonero.thisBlogPost") }}</UButton
                    >
                  </template>
                </I18nT>
              </p>
            </li>
            <li>
              <p>
                <I18nT keypath="whereToGetMonero.kraken">
                  <template #kraken>
                    <UButton to="https://kraken.com" v-bind="linkProps"
                      >kraken.com</UButton
                    >
                  </template>
                </I18nT>
              </p>
            </li>
            <li>
              <p>
                <I18nT keypath="whereToGetMonero.xmrbazaar">
                  <template #xmrbazaar>
                    <UButton to="https://xmrbazaar.com" v-bind="linkProps">
                      xmrbazaar.com
                    </UButton>
                  </template>
                </I18nT>
              </p>
            </li>
            <li>
              <p>
                <I18nT keypath="whereToGetMonero.gupax">
                  <template #gupax>
                    <UButton to="https://gupax.io" v-bind="linkProps">
                      gupax.io
                    </UButton>
                  </template>
                </I18nT>
              </p>
            </li>
            <li>
              <p>
                <I18nT keypath="whereToGetMonero.kunoAnneMedia">
                  <template #kunoAnneMedia>
                    <UButton to="https://kuno.anne.media/" v-bind="linkProps">
                      kuno.anne.media
                    </UButton>
                  </template>
                </I18nT>
              </p>
            </li>
            <li>
              <p>
                <I18nT keypath="whereToGetMonero.monerica">
                  <template #monerica>
                    <UButton to="https://monerica.com" v-bind="linkProps">
                      monerica.com
                    </UButton>
                  </template>

                  <template #monerodirectory>
                    <UButton
                      to="https://monerodirectory.com/"
                      v-bind="linkProps"
                    >
                      monerodirectory.com
                    </UButton>
                  </template>

                  <template #xmrbazaar>
                    <UButton to="https://xmrbazaar.com/" v-bind="linkProps">
                      xmrbazaar.com
                    </UButton>
                  </template>
                </I18nT>
              </p>
            </li>
          </ul>
        </template>
      </UAccordion>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list {
  @apply flex flex-col gap-3;
  .item-header {
    @apply pb-1 pt-2 flex items-center gap-2 text-text font-medium;
    .icon {
      @apply text-primary align-middle w-4 h-4;
    }
  }
  li {
  }
}
</style>
