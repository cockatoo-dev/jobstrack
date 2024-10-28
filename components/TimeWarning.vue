<script setup lang="ts">
  const props = defineProps<{
    serverTimestamp?: number
  }>()

  const timeWarning = computed(() => {
    const HOUR = 3600000
    if (!props.serverTimestamp) {
      return false
    } else if (Date.now() - props.serverTimestamp > HOUR) {
      return true
    } else if (props.serverTimestamp - Date.now() > HOUR) {
      return true
    } else {
      return false
    }
  })
</script>

<template>
  <div v-if="timeWarning" class="w-full bg-red-200 dark:bg-red-800">
    <div class="w-full sm:w-[39rem] lg:w-[56rem] 2xl:w-[73rem] mx-auto p-4 text-center text-slate-800 dark:text-slate-200 font-bold">
      Your device's date and time appears to be wrong. Some parts of this site may not work as intended. 
      Consider updating your device's date and time from your device settings.
    </div>
  </div>
</template>