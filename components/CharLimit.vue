<script setup lang="ts">
  defineProps<{
    str: string,
    limit: number,
    showLength: number
  }>()
</script>

<template>
  <div 
    class="transition-opacity duration-300 text-xs text-right"
    :class="str.length >= showLength ? 'opacity-100' : 'opacity-0'"
  >
    <span 
      class="transition-colors duration-300"
      :class="str.length >= limit ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'"
    >
      {{ str.length }}/{{ limit }}
    </span>
  </div>
</template>