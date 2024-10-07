<script setup lang="ts">
  import { FetchError } from 'ofetch'
  import { dayTimestamp } from '~/utils/utils'

  const isVisible = defineModel<boolean>()
  const props = defineProps<{
    beta: boolean
    refreshData: () => Promise<void>
  }>()

  const router = useRouter()

  const companyName = ref("")
  const jobTitle = ref("")
  const jobDescription = ref("")
  const hasApplied = ref(false)
  const formLoading = ref(false)
  const errorMessage = ref("")

  watch(isVisible, () => {
    if (!isVisible.value) {
      companyName.value = ""
      jobTitle.value = ""
      jobDescription.value = ""
      hasApplied.value = false
      errorMessage.value = ""
    }
  })
  
  const submitForm = async () => {
    formLoading.value = true
    try {
      await $fetch("/api/beta/job/addJob", {
        method: "post",
        body: {
          companyName: companyName.value,
          jobTitle: jobTitle.value,
          jobDescription: jobDescription.value,
          hasApplied: hasApplied.value,
          dayTimestamp: dayTimestamp()
        }
      })

      await props.refreshData()
      formLoading.value = false
      isVisible.value = false
    } catch (e) {
      formLoading.value = false
      if (e instanceof FetchError) {
        if (e.status === 401) {
          router.push("/login")
        } else if (e.status === 400) {
          errorMessage.value = e.data.message
        } else {
          throw e
        }
      }
    }
  }

</script>

<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    class="w-11/12 sm:w-[39rem] lg:w-[58rem] 2xl:w-[77rem]"
    header="Add Job"
  >
    <template #container>
      <div class="p-4 sm:p-8 overflow-auto">
        <h2 class="text-slate-800 dark:text-slate-200 text-3xl font-bold">Add a new job.</h2>
        <form @submit.prevent="submitForm">
          <div class="pb-2 text-sm text-slate-800 dark:text-slate-200">
            Fields marked with a * are required.
          </div>
          <div class="pb-4">
            <label 
              for="add-companyName"
              class="block pb-1 text-slate-800 dark:text-slate-200"
            >
              Company Name*
            </label>
            <InputText
              id="add-companyName"
              v-model="companyName"
              class="block w-full"
              required
            />
          </div>
          <div class="pb-4">
            <label 
              for="add-jobTitle"
              class="block pb-1 text-slate-800 dark:text-slate-200"
            >
              Job Title*
            </label>
            <InputText
              id="add-jobTitle"
              v-model="jobTitle"
              class="block w-full"
              required
            />
          </div>
          <div class="pb-4">
            <label 
              for="add-jobDescription"
              class="block pb-1 text-slate-800 dark:text-slate-200"
            >
              <div>Job Description</div>
              <div class="text-sm">
                It's a good idea to copy and paste the full job description from the job ad, so that you can refer back to it here in the future if the original job ad is removed.
              </div>
            </label>
            <Textarea
              id="add-jobDescription"
              v-model="jobDescription"
              class="block w-full"
              rows="5"
            />
          </div>
          <div class="pt-2 pb-4 flex gap-2">
            <div>
              <Checkbox 
                v-model="hasApplied"
                input-id="add-hasApplied"
                binary
              />
            </div>
            <div>
              <label
                for="add-hasApplied"
                class="text-slate-800 dark:text-slate-200"
              >
                Job Application Sent
              </label>
            </div>
          </div>
          <div class="py-2 flex gap-2">
            <Button 
              type="submit"
              label="Add Job"
              class="block"
              :loading="formLoading"
            />
            <Button 
              type="button"
              link
              label="Cancel"
              class="block"
              @click="() => isVisible = false"
            />
          </div>
          <FormError :message="errorMessage" />
        </form>
      </div>
    </template>
  </Dialog>
</template>