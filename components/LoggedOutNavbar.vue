<script setup lang="ts">
  defineProps<{
    beta?: boolean
  }>()
</script>

<template>
  <div class="w-full sm:w-[39rem] lg:w-[56rem] 2xl:w-[73rem] mx-auto p-1">
    <NavLogo :beta />
  </div>
</template>