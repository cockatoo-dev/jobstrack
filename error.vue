<script setup lang="ts">
  import type { NuxtError } from '#app'
  const props = defineProps<{
    error: NuxtError
  }>()

  onMounted(() => {
    if (props.error.statusCode === 404) {
      console.info("Error information:\n", props.error)
    } else {
      console.info("Error information:\n", props.error, "\nIf this error appears repeatedly, consider creating an issue at https://github.com/max8539/jobstrack/issues")
    }

  })
</script>

<template>
  <LoggedOutNavbar />
  <main class="w-full px-1 pb-16 sm:w-[39rem] lg:w-[56rem] 2xl:w-[73rem] pt-4 mx-auto text-slate-800 dark:text-slate-200">
    <h1 v-if="error.statusCode === 404" class="text-4xl font-bold text-slate-800 dark:text-slate-200 py-16 text-center">
      Page not found.
    </h1>
    <h1 v-else-if="error.statusCode >= 500" class="text-4xl font-bold text-slate-800 dark:text-slate-200 py-16 text-center">
      Something went wrong on our end.
    </h1>
    <h1 v-else class="text-4xl font-bold text-slate-800 dark:text-slate-200 py-16 text-center">
      Something went wrong on our end.
    </h1>
    <div class="text-center">
      <Button 
        as="router-link"
        to="/"
        label="Back to Safety"
      />
    </div>
    
  </main>
  <GithubLinks />
</template>