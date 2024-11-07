<script setup lang="ts">
  import { FetchError } from 'ofetch'

  const isVisible = defineModel<boolean>()
  const props = defineProps<{
    refreshData: () => Promise<void>
  }>()

  const { data, error, refresh } = useFetch("/api/beta/user/getSettings", {immediate: false})

  const isSettingsLoaded = ref(false)
  const settingsLoadError = ref(false)
  const remindDays = ref(14)
  const remindOfferDays = ref(3)
  const remindFuture = ref(true)
  const formLoading = ref(false)
  const errorMessage = ref("")

  watch(isVisible, async () => {
    if (isVisible.value) {
      isSettingsLoaded.value = false
      settingsLoadError.value = false
      await refresh()
      if (error.value?.statusCode === 403) {
        await navigateTo("/beta/login")
      } else if (data.value) {
        remindDays.value = data.value.remindDays
        remindOfferDays.value = data.value.remindOfferDays
        remindFuture.value = data.value.remindFuture
        isSettingsLoaded.value = true
      } else {
        settingsLoadError.value = true
      }
    } else {
      errorMessage.value = ""
    }
  })
  
  const submitForm = async () => {
    formLoading.value = true
    errorMessage.value = ""
    try {
      await $fetch("/api/beta/user/editSettings", {
        method: "post",
        body: {
          remindDays: remindDays.value,
          remindOfferDays: remindOfferDays.value,
          remindFuture: remindFuture.value
        }
      })
      await props.refreshData()
      formLoading.value = false
      isVisible.value = false
    } catch (e) {
      formLoading.value = false
      if (e instanceof FetchError) {
        if (e.status === 403) {
          await navigateTo("/beta/login")
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
    class="w-11/12 sm:w-[37rem]"
    header="Add Job"
  >
    <template #container>
      <div class="p-2 sm:p-8 overflow-auto text-slate-800 dark:text-slate-200">
        <div class="grid grid-cols-[1fr_auto]">
          <h2 class=" text-3xl font-bold">User Settings</h2>
          <Button 
            text
            label="Close"
            autofocus
            @click="() => {isVisible = false}"
          />
        </div>
        
        <h3 class="pt-4  text-xl font-bold">Job Reminder Settings</h3>
        <form v-if="isSettingsLoaded" @submit.prevent="submitForm">
          <div class="pb-4">
            <label 
              for="settings-remindDays"
              class="block pb-1 "
            >
              Remind me to follow up on a job after:
            </label>
            <InputNumber 
              v-model="remindDays"
              input-id="settings-remindDays"
              show-buttons
              button-layout="horizontal"
              :min="0"
              suffix=" days"
              required
              class="block"
              fluid
            />
          </div>
          <div class="pb-4">
            <label 
              for="settings-remindOfferDays"
              class="block pb-1 "
            >
              Remind me to respond to a job offer after:
            </label>
            <InputNumber 
              v-model="remindOfferDays"
              input-id="settings-remindOfferDays"
              show-buttons
              button-layout="horizontal"
              :min="0"
              suffix=" days"
              required
              class="block"
              fluid
            />
          </div>
          <div class="pb-2 flex gap-2">
            <div>
              <Checkbox 
                v-model="remindFuture"
                input-id="settings-remindFuture"
                binary
              />
            </div>
            <div>
              <label
                for="settings-remindFuture"
                class="block pt-0.5 "
              >
                Remind me about jobs with upcoming events.
              </label>
            </div>
          </div>

          <div class="py-2">
            <Button 
              type="submit"
              label="Save & Close"
              class="block"
              fluid
              :loading="formLoading"
            />
          </div>
          <FormError :message="errorMessage" />
        </form>
        <DataLoadingError v-else-if="settingsLoadError" />
        <DataLoading v-else />

        <h3 class="pt-4  text-xl font-bold">User Account Settings</h3>
        <div class="pt-2">
          <Button 
            type="button"
            label="Change Password"
            as="router-link"
            to="/beta/account/changePassword"
            class="block"
            text
            fluid
          />
        </div>
        <div class="pt-2">
          <Button 
            type="button"
            label="Delete Account"
            severity="danger"
            as="router-link"
            to="/beta/account/deleteAccount"
            class="block"
            text
            fluid
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>