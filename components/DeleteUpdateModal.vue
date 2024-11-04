<script setup lang="ts">
  import { FetchError } from 'ofetch'
  
  const isVisible = defineModel<boolean>()
  const props = defineProps<{
    beta?: boolean
    jobId: string | string[]
    updateId: string
    refreshData: () => Promise<void>
  }>()
  const deleteLoading = ref(false)

  const deleteJob = async () => {
    deleteLoading.value = true
    try {
      if (props.beta) {
        await $fetch("/api/beta/update/deleteUpdate", {
          method: "post",
          body: {
            jobId: props.jobId,
            updateId: props.updateId
          }
        })
        await props.refreshData()
        deleteLoading.value = false
        isVisible.value = false
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
      <div class="p-4 text-slate-800 dark:text-slate-200">
        <h3 class=" text-xl font-bold">
          Delete Update?
        </h3>
        <p>
          You are about to delete this update. This cannot be undone.
        </p>
        <div class="pt-2 flex gap-2">
          <Button 
            type="button"
            severity="danger"
            label="Delete Update"
            class="block"
            :loading="deleteLoading"
            @click="deleteJob"
          />
          <Button 
            type="button"
            text
            label="Cancel"
            autofocus
            class="block"
            @click="() => {isVisible = false}"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>