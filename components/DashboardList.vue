<script setup lang="ts">
  const props = defineProps<{
    beta?: boolean
    timestamp: number
    search?: boolean
    jobs: dashboardJobItem[]
    refreshData: () => Promise<void>
  }>()
  
  const searchStr = ref("")
  const searchContains = (data: string) => {
    return (data.toLowerCase().includes(searchStr.value.toLowerCase()))
  }
  const displayJobs = computed(() => {
    if (!props.search) {
      return props.jobs
    }
    if (searchStr.value === "") {
      return props.jobs
    } else {
      const result = []
      for (const job of props.jobs) {
        if (searchContains(job.companyName) || searchContains(job.jobTitle)) {
          result.push(job)
        }
      }
      return result
    }
  })
</script>

<template>
  <div class="w-full mx-auto">
    <div v-if="search" class="w-full py-2">
      <label for="dashboard-search" class="hidden">Search for a job</label>
      <InputText 
        id="dashboard-search"
        v-model="searchStr" 
        placeholder="Search for a job..." 
        fluid
      />
    </div>
    <div class="w-full sm:w-[34rem] sm:grid sm:grid-cols-2 lg:w-[51rem] lg:grid-cols-3 2xl:w-[68rem] 2xl:grid-cols-4 mx-auto">
      <JobItem
        v-for="job of displayJobs"
        :key="job.jobId"
        :job-data="job"
        :refresh-data="refreshData"
        :timestamp
        :beta
      />
    </div>
  </div>
</template>