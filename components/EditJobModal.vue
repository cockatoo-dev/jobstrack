<script setup lang="ts">
  import { FetchError } from 'ofetch'
  
  const isVisible = defineModel<boolean>()
  const props = defineProps<{
    beta?: boolean
    jobId: string | string[]
    currentCompanyName: string
    currentJobTitle: string
    currentJobDescription: string
    refreshData: () => Promise<void>
  }>()

  const companyName = ref("")
  const jobTitle = ref("")
  const jobDescription = ref("")
  const formLoading = ref(false)
  const errorMessage = ref("")

  watch(isVisible, () => {
    if (isVisible.value) {
      companyName.value = props.currentCompanyName
      jobTitle.value = props.currentJobTitle
      jobDescription.value = props.currentJobDescription
    }
  })

  const submitForm = async () => {
    if (companyName.value.length > 100) {
      errorMessage.value = "Company name is too long (maximum 100 characters)."
      formLoading.value = false
      return
    } else if (jobTitle.value.length > 100) {
      errorMessage.value = "Job title is too long (maximum 100 characters)."
      formLoading.value = false
      return
    } else if (jobDescription.value.length > 10000) {
      errorMessage.value = "Job description is too long (maximum 10000 characters)."
      formLoading.value = false
      return
    }

    errorMessage.value = ""
    try {
      if (props.beta) {
        await $fetch("/api/beta/job/editJob", {
        method: "post",
        body: {
          jobId: props.jobId,
          companyName: companyName.value,
          jobTitle: jobTitle.value,
          jobDescription: jobDescription.value,
        }
      })
      }
      
      await props.refreshData()
      formLoading.value = false
      isVisible.value = false
    } catch (e) {
      formLoading.value = false
      if (e instanceof FetchError) {
        if (e.status === 403) {
          if (props.beta) {
            await navigateTo("/beta/login")
          } else {
            await navigateTo("/login")
          }
        } else if (e.status === 400) {
          errorMessage.value = e.data.message
        } else {
          throw e
        }
      } else {
        throw e
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
      <div class="p-2 sm:p-8 overflow-auto text-slate-800 dark:text-slate-200">
        <h2 class=" text-3xl font-bold">Edit this job.</h2>
        <form @submit.prevent="submitForm">
          <div class="pb-2 text-sm ">
            Fields marked with a * are required.
          </div>

          <div class="pb-2">
            <label 
              for="edit-companyName"
              class="block pb-1 "
            >
              Company Name*
            </label>
            <InputText
              id="edit-companyName"
              v-model="companyName"
              required
              :invalid="companyName.length > 100"
              autofocus
              class="block"
              fluid
            />
            <CharLimit :str="companyName" :limit="100" :show-length="50" />
          </div>

          <div class="pb-2">
            <label 
              for="edit-jobTitle"
              class="block pb-1 "
            >
              Job Title*
            </label>
            <InputText
              id="edit-jobTitle"
              v-model="jobTitle"
              required
              :invalid="jobTitle.length > 100"
              class="block"
              fluid
            />
            <CharLimit :str="jobTitle" :limit="100" :show-length="50" />
          </div>

          <div class="pb-2">
            <label 
              for="edit-jobDescription"
              class="block pb-1 "
            >
              <div>Job Description</div>
            </label>
            <Textarea
              id="edit-jobDescription"
              v-model="jobDescription"
              :invalid="companyName.length > 10000"
              class="block"
              fluid
              rows="5"
            />
            <CharLimit :str="jobDescription" :limit="10000" :show-length="8000" />
          </div>

          <div class="py-2 flex gap-2">
            <Button 
              type="submit"
              label="Save Changes"
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