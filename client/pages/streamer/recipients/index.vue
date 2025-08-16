<script setup lang="ts"></script>

<template>
  <div>
    <PageTitle
      title="Page Recipients"
      description="Manage the recipients of the page"
    />
    <div class="grid gap-4">
      <RecipientItem
        :modelValue="{
          name: 'Address',
          address: '4CscFcV...RQ8RZX',
          percentage: 80,
        }"
      />
      <RecipientItem
        :modelValue="{ name: 'XMRChat', address: '4CscFcV...RQ8RZX' }"
        editablePercentage
      />
      <RecipientItem editableAddress editablePercentage showDelete />
    </div>
  </div>
</template>
