<script setup lang="ts"></script>

<template>
  <div class="m-4">
    <div class="guide inner">
      <h4 class="title">WALLET GUIDES</h4>
      <div class="page">
        <div class="how-to">
          <p>
            How to find the primary address and private view key (also known as
            secret view key):
          </p>
          <h5>Cake Wallet:</h5>
          <h6>
            <UIcon name="i-mdi-arrow-right-thin" class="text-3xl" /> To get your
            primary address:
          </h6>
          <ul>
            <li>1. Click on "Receive"</li>
            <li>2. Copy the address that begins with 4</li>
          </ul>

          <h6>
            <UIcon name="i-mdi-arrow-right-thin" class="text-3xl" /> To get your
            view key
          </h6>
          <ul>
            <li>
              1. Click on Settings
              <span class="text-orange-500">-></span> Security and backup
              <span class="text-orange-500">-></span> Show seed/keys
            </li>
            <li>2. Copy "View key (private)"</li>
          </ul>
        </div>
        <div class="images">
          <div>
            <img
              class="rounded-xl"
              src="/images/kuno_view_key_cake.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>

    <div class="guide inner">
      <div class="page">
        <div class="how-to">
          <h5>GUI Wallet:</h5>
          <ul>
            <li>
              1. Click on Settings <span class="text-orange-500">-></span> Seeds
              & Keys
            </li>
            <li>2. Copy "Primary address" and "Secret view key"</li>
          </ul>
        </div>
        <div class="images">
          <div>
            <img
              class="rounded-xl"
              src="/images/kuno_view_key_gui.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>

    <div class="guide inner">
      <div class="page">
        <div class="how-to">
          <h5>Feather Wallet:</h5>
          <ul>
            <li>
              1. Click on Wallet <span class="text-orange-500">-></span> Keys
            </li>
            <li>2. Copy "Primary address" and "Secret view key"</li>
          </ul>
        </div>
        <div class="images">
          <div>
            <img
              class="rounded-xl"
              src="/images/kuno_view_key_feather.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.guide {
  @apply p-8 bg-background-2 shadow-md rounded-xl mt-10;
  .title {
    @apply font-bold text-4xl mb-5 border-b border-border pb-4;
  }
}
.page {
  @apply flex gap-8  justify-between;
  .how-to {
    @apply w-[60%] flex flex-col gap-4;
    p {
      @apply text-lg;
    }
    h5 {
      @apply font-bold text-xl;
    }
    h6 {
      @apply text-lg text-pale flex items-center gap-1;
    }
    ul {
      @apply flex gap-3 flex-col;
      li {
        @apply bg-background py-4 px-6 border-border border rounded-lg text-lg;
      }
    }
  }
  .images {
    @apply w-[40%] flex justify-end;
  }
}
@media screen and (max-width: 768px) {
  .guide {
    @apply p-5;
  }
  .page {
    @apply flex gap-8 flex-col;
    .how-to {
      ul {
        @apply flex gap-3 flex-col;
        li {
          @apply text-base;
        }
      }
    }

    .how-to,
    .images {
      @apply w-full;
    }
    .images {
      justify-content: center;
    }
  }
}
</style>
