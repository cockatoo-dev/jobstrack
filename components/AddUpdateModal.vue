<script setup lang="ts">
  import { FetchError } from 'ofetch'
  import { DAY } from "#imports"
  
  const isVisible = defineModel<boolean>()
  const props = defineProps<{
    beta: boolean
    timestamp: number
    jobId: string | string[]
    lastUpdateType: string
    hasDismissRemind: boolean
    refreshData: () => Promise<void>
  }>()

  const updateType = ref("")
  const updateSelection = ref<string[]>([])
  const disableFuture = ref(true)
  const updateTimeOption = ref("today")
  const updateDate = ref(new Date(0))
  const limitDate = ref(new Date(0))
  const updateNotes = ref("")
  const formLoading = ref(false)
  const errorMessage = ref("")
  
  watch(isVisible, () => {
    if (isVisible.value) {
      updateDate.value = new Date(props.timestamp + DAY)
      limitDate.value = new Date(props.timestamp)
      
      if (props.lastUpdateType === updateTypes.ACCEPT_OFFER) {
        updateSelection.value = []
      } else if (props.lastUpdateType === updateTypes.RECEIVE_OFFER) {
        updateSelection.value = [
          updateTypes.ACCEPT_OFFER, 
          updateTypes.DECLINE_OFFER,
          updateTypes.REJECT,
          updateTypes.WAITLIST
        ]
      } else if (props.lastUpdateType === updateTypes.NO_APPLICATION) {
        updateSelection.value = [
          updateTypes.APPLICATION_SENT,
          updateTypes.ONLINE_ASSESS,
          updateTypes.TAKE_HOME,
          updateTypes.INTERVIEW,
          updateTypes.PHONE_INTERVIEW,
          updateTypes.VIRTUAL_INTERVIEW,
          updateTypes.TECH_INTERVIEW,
          updateTypes.BEHAVE_INTERVIEW,
          updateTypes.FINAL_INTERVIEW,
          updateTypes.ASSESS_CENTER,
          updateTypes.RECEIVE_OFFER,
          updateTypes.ACCEPT_OFFER, 
          updateTypes.DECLINE_OFFER,
          updateTypes.REJECT,
          updateTypes.WAITLIST
        ]
      } else {
        updateSelection.value = [
          updateTypes.ONLINE_ASSESS,
          updateTypes.TAKE_HOME,
          updateTypes.INTERVIEW,
          updateTypes.PHONE_INTERVIEW,
          updateTypes.VIRTUAL_INTERVIEW,
          updateTypes.TECH_INTERVIEW,
          updateTypes.BEHAVE_INTERVIEW,
          updateTypes.FINAL_INTERVIEW,
          updateTypes.ASSESS_CENTER,
          updateTypes.RECEIVE_OFFER,
          updateTypes.ACCEPT_OFFER, 
          updateTypes.DECLINE_OFFER,
          updateTypes.REJECT,
          updateTypes.WAITLIST
        ]
      }
    } else {
      updateTimeOption.value = "today"
      updateNotes.value = ""
    }
  })

  watch(updateType, () => {
    if (
      updateType.value === updateTypes.TAKE_HOME ||
      updateType.value === updateTypes.INTERVIEW ||
      updateType.value === updateTypes.PHONE_INTERVIEW ||
      updateType.value === updateTypes.VIRTUAL_INTERVIEW ||
      updateType.value === updateTypes.TECH_INTERVIEW ||
      updateType.value === updateTypes.BEHAVE_INTERVIEW ||
      updateType.value === updateTypes.FINAL_INTERVIEW ||
      updateType.value === updateTypes.ASSESS_CENTER
    ) {
      disableFuture.value = false
    } else {
      updateTimeOption.value = "today"
      disableFuture.value = true
    }
  })

  const submitForm = async () => {
    formLoading.value = true
    if (updateNotes.value.length > 1000) {
      errorMessage.value = "Update notes is too long (maximum 1000 characters)."
      formLoading.value = false
      return
    } else if (updateDate.value.getTime() < limitDate.value.getTime()) {
      errorMessage.value = "Update date is invalid."
      formLoading.value = false
      return
    }

    errorMessage.value = ""
    const isFuture = updateTimeOption.value === "future"
    const updateTime = isFuture ? updateDate.value.getTime() : Date.now()
    const updateDay = new Date(new Date(updateTime).toDateString()).getTime()
    try {
      if (props.beta) {
        await $fetch("/api/beta/update/addUpdate", {
          method: "post",
          body: {
            jobId: props.jobId,
            updateType: updateType.value,
            isFuture,
            updateTime,
            updateDay,
            updateNotes: updateNotes.value,
            hasDismissRemind: props.hasDismissRemind
          }
        })
        await props.refreshData()
        formLoading.value = false
        isVisible.value = false
      }
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
      <div class="p-4 sm:p-8 overflow-auto">
        <h2 class="text-slate-800 dark:text-slate-200 text-3xl font-bold">Add an update.</h2>
        <form @submit.prevent="submitForm">
          <div class="pb-2 text-sm text-slate-800 dark:text-slate-200">
            Fields marked with a * are required.
          </div>
          
          <div class="pb-4">
            <label 
              for="update-updateType"
              class="block pb-1 text-slate-800 dark:text-slate-200"
            >
              Update Type*
            </label>
            <Select 
              v-model="updateType"
              input-id="update-updateType"
              :options="updateSelection"
              required
              class="block"
              fluid
            />
          </div>

          <div class="pb-4">
            <div class="block pb-1 text-slate-800 dark:text-slate-200">Update Time</div>
            <div class="flex gap-2">
              <RadioButton 
                v-model="updateTimeOption" 
                input-id="update-updateTime-today" 
                name="update-updateTime" 
                value="today"
              />
              <label 
                for="update-updateTime-today" 
                class="text-slate-800 dark:text-slate-200"
              >
                Today
              </label>
              <RadioButton 
                v-model="updateTimeOption"
                input-id="update-updateTime-future"
                name="update-updateTime"
                value="future"
                :disabled="disableFuture"
              />
              <label
                for="update-updateTime-future"
                :class="disableFuture ? 'text-slate-500' : 'text-slate-800 dark:text-slate-200'"
              >
                In the future
              </label>
            </div>
            <div v-if="updateTimeOption === 'future'" class="pt-2">
              <label class="hidden" for="update-updateDate">Select update date and time.</label>
              <DatePicker 
                v-model="updateDate"
                input-id="update-updateDate"
                :min-date="limitDate"
                :manual-input="false"
                show-time
                date-format="MM d, yy,"
                hour-format="12"
                fluid
              />
            </div>
          </div>

          <div class="pb-4">
            <label 
              for="update-updateNotes"
              class="block pb-1 text-slate-800 dark:text-slate-200"
            >
              <div>Update Notes</div>
              <div class="text-sm">
                Any notes you may want to keep about this update.
              </div>
            </label>
            <Textarea
              id="update-updateNotes"
              v-model="updateNotes"
              :invalid="updateNotes.length > 1000"
              class="block"
              fluid
              rows="5"
            />
            <CharLimit :str="updateNotes" :limit="1000" :show-length="800" />
          </div>

          <div class="py-2 flex gap-2">
            <Button 
              type="submit"
              label="Add Update"
              class="block"
              :loading="formLoading"
            />
            <Button 
              type="button"
              text
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