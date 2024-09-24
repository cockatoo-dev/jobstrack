<script setup lang="ts">
  const route = useRoute()

  const { data, error, refresh } = useFetch("/api/beta/job/getJob", {
    method: 'get',
    query: {jobId: route.params.jobId}
  })

  watch(error, async () => {
    if (error.value?.status === 401) {
      navigateTo("/login")
    }
  })
</script>

<template>
  <div>
    <LoggedInNavbar :refresh-data="refresh" />

    <div class="w-[20rem] sm:w-[40rem] lg:w-[60rem] 2xl:w-[80rem] pt-4 mx-auto">
      <Button link as="router-link" to="/dashboard" label="Back" />
      <div>Job {{ route.params.jobId }}</div>
    </div>
    
    
  </div>
</template>