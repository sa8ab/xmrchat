<script lang="ts" setup>
const items = computed(() => [
  {
    label: "Why tip with XMRChat?",
    defaultOpen: true,
    slot: "one",
  },
  {
    label: "Why does XMRChat use Monero?",
    slot: "two",
  },
  {
    label: "Where to get Monero?",
    slot: "three",
  },
]);

const linkProps = { padded: false, target: "_blank", variant: "link" } as any; // UButton does not export props I guess
</script>

<template>
  <div class="mt-7">
    <h3 class="w-full text-center text-4xl font-bold">FAQ</h3>
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
              <UIcon
                name="i-heroicons-chevron-right-20-solid"
                :class="[
                  'w-5 h-5 transform transition-transform duration-200',
                  open && 'rotate-90',
                ]"
              ></UIcon>
            </template>
          </UButton>
        </template>
        <template #one>
          <ul class="list">
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>Earn More </span>
              </div>
              <p>
                YouTube charges 30-50% for Superchats. Rumble 20% for Rants.
                With XMRChat, the streamer gets 100% of your tip, directly to a
                wallet they control.
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>Private </span>
              </div>
              <p>
                Viewers can tip anonymously, no worries from employers or others
                knowing your donations.
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>Quick and easy</span>
              </div>
              <p>
                No need for viewers to create an account, verify their email, or
                enter credit card info. Just go to your streamer’s page, type
                your message and enter your XMR tip.
              </p>
            </li>

            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>Censorship resistant</span>
              </div>
              <p>
                Streamers that tell too much truth may one day face censorship
                not only from big tech, but from banks freezing their accounts
                as well. Better to be prepared with another payment method.
              </p>
            </li>
          </ul>
        </template>
        <template #two>
          <ul class="list">
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>Low fees</span>
              </div>
              <p>Monero transaction fees are a few pennies at most.</p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>Private</span>
              </div>
              <p>
                While most crypto uses open ledgers, Monero hides transaction
                data. Sender, receiver, and transaction amounts are not revealed
                by looking at the blockchain.
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>Accepted</span>
              </div>
              <p>
                Selling your crypto for fiat on a centralized exchange creates a
                taxable event. Avoid that hassle and expense by buying goods and
                services from merchants that accept Monero, listed at
                <UButton to="https://monerica.com" v-bind="linkProps">
                  monerica.com</UButton
                >.
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>And more</span>
              </div>
              <p>
                Learn more about Monero at
                <UButton to="https://getmonero.org" v-bind="linkProps">
                  getmonero.org</UButton
                >.
              </p>
            </li>
          </ul>
        </template>
        <template #three>
          <ul class="list">
            <li>
              <p>
                If you already have crypto, trade for Monero (XMR) at
                <UButton to="https://trocador.app" v-bind="linkProps">
                  trocador.app</UButton
                >.
              </p>
            </li>
            <li>
              <p>
                Buy Monero without KYC at
                <UButton to="https://haveno.exchange" v-bind="linkProps"
                  >haveno.exchange</UButton
                >. Cash by mail tutorial at
                <UButton
                  to="https://blog.nihilism.network/servers/haveno-cashbymail/index.html"
                  v-bind="linkProps"
                  >this blog post</UButton
                >.
              </p>
            </li>
            <li>
              <p>
                Buy Monero with KYC at
                <UButton to="https://kraken.com" v-bind="linkProps"
                  >kraken.com</UButton
                >.
              </p>
            </li>
            <li>
              <p>
                Sell items or services for Monero at
                <UButton to="https://xmrbazaar.com" v-bind="linkProps">
                  xmrbazaar.com
                </UButton>
                and
                <UButton to="https://moneromarket.io" v-bind="linkProps">
                  moneromarket.io </UButton
                >.
              </p>
            </li>
            <li>
              <p>
                Mine it with
                <UButton to="https://gupax.io" v-bind="linkProps">
                  gupax.io </UButton
                >.
              </p>
            </li>
            <li>
              <p>
                Buy Monero with fiat, without KYC as an Executor at
                <UButton to="https://monezon.com" v-bind="linkProps">
                  monezon.com </UButton
                >.
              </p>
            </li>
            <li>
              <p>
                Accept Monero at your business and get listed at the
                <UButton to="https://monerica.com" v-bind="linkProps">
                  monerica.com
                </UButton>
                directory.
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
