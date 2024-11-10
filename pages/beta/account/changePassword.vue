<script setup lang="ts">
  import { FetchError } from 'ofetch'

  useHead({title: "Change Password | JobsTrack"})
  
  const oldPass = ref("")
  const newPass = ref("")
  const confirmPass = ref("")
  const formLoading = ref(false)
  const formError = ref("")

  const submitForm = async () => {
    formLoading.value = true
    if (newPass.value !== confirmPass.value) {
      formLoading.value = false
      formError.value = "New passwords do not match."
      return
    }
    formError.value = ""
    try {
      await $fetch("/api/beta/auth/changePassword", {
        method: "post",
        body: {
          oldPass: oldPass.value,
          newPass: newPass.value,
          confirmPass: confirmPass.value
        }
      })
      await navigateTo("/beta/dashboard")
    } catch (e) {
      formLoading.value = false
      if (e instanceof FetchError) {
        if (e.status === 403) {
          await navigateTo("/beta/login")
        } else if (e.status === 400) {
          formError.value = e.data.message
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
  <div>
    <LoggedOutNavbar beta />
    <main class="p-4 mx-auto sm:w-[40rem] text-slate-800 dark:text-slate-200">
      <h2 class="py-4 text-3xl font-bold">Change your password.</h2>
      <form @submit.prevent="submitForm">
        <div class="pb-2 text-sm ">
          All fields are required.
        </div>
        <div class="pb-4">
          <label 
            for="change-oldPass"
            class="block pb-1 "
          >
            Old Password
          </label>
          <Password
            v-model="oldPass" 
            input-id="change-oldPass"
            :feedback="false"
            class="block"
            fluid
          />
        </div>
        <div class="pb-4">
          <label 
            for="change-newPass"
            class="block pb-1 "
          >
            New Password
          </label>
          <Password
            v-model="newPass"
            input-id="change-newPass"  
            class="block"
            toggle-mask
            fluid
            required
          />
        </div>
        <div class="pb-4">
          <label 
            for="change-confirmPass"
            class="block pb-1 "
          >
            Confirm New Password
          </label>
          <Password
            v-model="confirmPass" 
            input-id="change-confirmPass" 
            :feedback="false"
            class="block"
            fluid
            required
          />
        </div>
        <p class="pb-2 text-red-600 dark:text-red-400 text-center font-bold">
          There is no way to recover beta accounts if the password is forgotten. Make sure to remember your password, or store it somewhere safe.
        </p>
        <div class="py-2 flex gap-2">
          <Button 
            type="submit"
            :loading="formLoading"
            label="Change Password"
            class="block"
          />
          <Button 
            type="button"
            as="router-link"
            to="/beta/dashboard"
            label="Cancel"
            text
            class="block"
          />
        </div>
        <FormError :message="formError" />
      </form>
    </main>
  </div>
</template>