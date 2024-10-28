<script setup lang="ts">
  defineProps<{
    beta?: boolean
  }>()
</script>

<template>
  <div class="pl-1 text-3xl font-bold text-slate-800 dark:text-slate-200">
    <NuxtLink to="/">
      Jobs<span class=" text-fuchsia-500">Track</span><span v-if="beta" class="text-base font-normal">{{ " Beta" }}</span>
    </NuxtLink>
  </div>
</template>