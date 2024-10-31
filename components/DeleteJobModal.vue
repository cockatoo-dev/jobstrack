<script setup lang="ts">
  import { FetchError } from 'ofetch'
  
  const isVisible = defineModel<boolean>()
  const props = defineProps<{
    beta?: boolean
    jobId: string | string[]
  }>()
  const deleteLoading = ref(false)

  const deleteJob = async () => {
    deleteLoading.value = true
    try {
      if (props.beta) {
        await $fetch("/api/beta/job/deleteJob", {
          method: "post",
          body: {
            jobId: props.jobId
          }
        })
        await navigateTo("/beta/dashboard")
        deleteLoading.value = false
      }
    } catch (e) {
      if (!(e instanceof FetchError)) {
        throw e
      }
      deleteLoading.value = false
    }
    
  }
</script>

<template>
  <Dialog
    v-model:visible=isVisible
    modal
    class="w-11/12 sm:w-[37rem]"
  >
  <template #container>
      <div class="p-4">
        <div class="text-slate-800 dark:text-slate-200 text-xl font-bold">
          Delete Job?
        </div>
        <div class="text-slate-800 dark:text-slate-200">
          You are about to delete this job and all updates made to this job. This cannot be undone.
        </div>
        <div class="pt-2 flex gap-2">
          <Button 
            type="button"
            severity="danger"
            label="Delete Job"
            class="block"
            :loading="deleteLoading"
            @click="deleteJob"
          />
          <Button 
            type="button"
            text
            label="Cancel"
            class="block"
            @click="() => {isVisible = false}"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>