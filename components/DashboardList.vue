<script setup lang="ts">

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const props = defineProps<{
    jobs: dashboardJobItem[]
    refreshData: () => Promise<void>
  }>()
</script>

<template>
  <div class="w-[19rem] sm:grid sm:grid-cols-2 sm:w-[38rem] lg:grid-cols-3 lg:w-[57rem] 2xl:grid-cols-4 2xl:w-[76rem] mx-auto">
    <JobItem
      v-for="job of jobs"
      :key="job.jobId"
      :job-data="job"
      :refresh-data="refreshData"
    />
  </div>
</template>