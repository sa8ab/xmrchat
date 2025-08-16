<script setup lang="ts"></script>

<template>
  <div>
    <PageTitle
      title="Page Recipients"
      description="Manage the recipients of the page"
    />
    <div class="grid gap-2">
      <RecipientItem />
      <RecipientItem editableAddress editablePercentage showDelete />
    </div>
  </div>
</template>
