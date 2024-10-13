<script setup lang="ts">
  defineProps<{
    beta: boolean
    timestamp: number
    jobs: dashboardJobItem[]
    refreshData: () => Promise<void>
  }>()
</script>

<template>
  <div class="w-full sm:grid sm:grid-cols-2 sm:w-[34rem] lg:grid-cols-3 lg:w-[51rem] 2xl:grid-cols-4 2xl:w-[68rem] mx-auto">
    <JobItem
      v-for="job of jobs"
      :key="job.jobId"
      :job-data="job"
      :refresh-data="refreshData"
      :timestamp
      :beta
    />
  </div>
</template>