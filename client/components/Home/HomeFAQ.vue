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
                With XMRChat you receive 100% of your XMR tips from fans,
                directly to your Monero wallet.
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>Censorship resistant</span>
              </div>
              <p>
                Accepting Monero tips allows you to have an income that is not
                directly connected to big tech and arbitrary policy violations.
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>Corruption Resistant</span>
              </div>
              <p>
                Many regimes seize or freeze bank accounts of political enemies.
                Monero allows you to be your own bank with complete control of
                your finances.
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
                enter credit card info. Fans go to your tip page, type their
                name, message, amount, and submit their XMR tip.
              </p>
            </li>
            <li>
              <div class="item-header">
                <UIcon name="i-heroicons-check-16-solid" class="icon" />
                <span>Open Source</span>
              </div>
              <p>
                XMRChat is open source. You can review the code
                <UButton
                  to="https://github.com/sa8ab/xmrchat"
                  v-bind="linkProps"
                >
                  here</UButton
                >.
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
                Avoid the hassle of selling your crypto on a centralized
                exchange. Buy goods and services directly from merchants that
                accept Monero on
                <UButton to="https://xmrbazaar.com" v-bind="linkProps">
                  xmrbazaar.com</UButton
                >
                and
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
                Buy or trade other crypto for Monero in
                <UButton to="https://cakewallet.com" v-bind="linkProps">
                  Cake Wallet</UButton
                >.
              </p>
            </li>
            <li>
              <p>
                Trade other crypto for Monero (XMR) at
                <UButton to="https://stealthex.io" v-bind="linkProps">
                  stealthex.io</UButton
                >
                and others at
                <UButton
                  to="https://kycnot.me/?t=exchange&q=&xmr=on"
                  v-bind="linkProps"
                >
                  kycnot.me</UButton
                >.
              </p>
            </li>
            <li>
              <p>
                Buy Monero without KYC at
                <UButton to="https://haveno-reto.com/" v-bind="linkProps"
                  >haveno-reto.com</UButton
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
                  xmrbazaar.com </UButton
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
                Create a Monero Fundraiser at
                <UButton to="https://kuno.anne.media/" v-bind="linkProps">
                  kuno.anne.media </UButton
                >.
              </p>
            </li>
            <li>
              <p>
                Accept Monero at your business and get listed at the
                <UButton to="https://monerica.com" v-bind="linkProps">
                  monerica.com
                </UButton>
                and
                <UButton to="https://monerodirectory.com/" v-bind="linkProps">
                  monerodirectory.com
                </UButton>
                pages and the business listings map on
                <UButton to="https://xmrbazaar.com/" v-bind="linkProps">
                  xmrbazaar.com </UButton
                >.
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
