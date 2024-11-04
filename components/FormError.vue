<script setup lang="ts">
  defineProps<{
    message: string
  }>()
</script>

<template>
  <div
    v-if="message"
    class="rounded-md bg-red-200 dark:bg-red-800 border-2 border-red-500 text-slate-800 dark:text-slate-200"
  >
    <p class="p-2">
      {{ message }}
    </p>
  </div>
</template>