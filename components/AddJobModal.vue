<script setup lang="ts">
  import { FetchError } from 'ofetch'

  const isVisible = defineModel<boolean>()
  const props = defineProps<{
    beta: boolean
    refreshData: () => Promise<void>
  }>()

  const companyName = ref("")
  const jobTitle = ref("")
  const jobDescription = ref("")
  const hasApplied = ref(false)
  const applicationNotes = ref("")
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
    } else if (applicationNotes.value.length > 1000) {
      errorMessage.value = "Application notes is too long (maximumn 1000 characters)."
      formLoading.value = false
      return
    }

    errorMessage.value = ""
    try {
      if (props.beta) {
        await $fetch("/api/beta/job/addJob", {
        method: "post",
        body: {
          companyName: companyName.value,
          jobTitle: jobTitle.value,
          jobDescription: jobDescription.value,
          hasApplied: hasApplied.value,
          timestamp: Date.now(),
          dayTimestamp: dayTimestamp(),
          applicationNotes: applicationNotes.value
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
      <div class="p-2 sm:p-8 overflow-auto">
        <h2 class="text-slate-800 dark:text-slate-200 text-3xl font-bold">Add a new job.</h2>
        <form @submit.prevent="submitForm">
          <div class="pb-2 text-sm text-slate-800 dark:text-slate-200">
            Fields marked with a * are required.
          </div>

          <div class="pb-2">
            <label 
              for="add-companyName"
              class="block pb-1 text-slate-800 dark:text-slate-200"
            >
              Company Name*
            </label>
            <InputText
              id="add-companyName"
              v-model="companyName"
              required
              :invalid="companyName.length > 100"
              class="block"
              fluid
            />
            <CharLimit :str="companyName" :limit="100" :show-length="50" />
          </div>

          <div class="pb-2">
            <label 
              for="add-jobTitle"
              class="block pb-1 text-slate-800 dark:text-slate-200"
            >
              Job Title*
            </label>
            <InputText
              id="add-jobTitle"
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
              :invalid="companyName.length > 10000"
              class="block"
              fluid
              rows="5"
            />
            <CharLimit :str="jobDescription" :limit="10000" :show-length="8000" />
          </div>

          <div class="pb-4 flex gap-2">
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

          <div v-if="hasApplied" class="pb-2">
            <label 
              for="add-applicationNotes"
              class="block pb-1 text-slate-800 dark:text-slate-200"
            >
              <div>Application Notes</div>
              <div class="text-sm">
                Any notes you may want to keep about the job application.
              </div>
            </label>
            <Textarea
              id="add-applicationNotes"
              v-model="applicationNotes"
              :invalid="companyName.length > 1000"
              class="block"
              fluid
              rows="5"
            />
            <CharLimit :str="applicationNotes" :limit="1000" :show-length="800" />
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