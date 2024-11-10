<script setup lang="ts">
  import { FetchError } from 'ofetch'

  useHead({title: "Delete Account | JobsTrack"})
  
  const pass = ref("")
  const formLoading = ref(false)
  const formError = ref("")

  const submitForm = async () => {
    formLoading.value = true
    formError.value = ""
    try {
      await $fetch("/api/beta/auth/deleteAccount", {
        method: "post",
        body: {
          pass: pass.value
        }
      })
      await navigateTo("/")
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
      <h2 class="pb-2 text-3xl font-bold">Delete your account?</h2>
      <p class="pb-2">
        You are about to delete your account. All your data, including all your jobs and updates, will be deleted. This cannot be undone.
      </p>
      <form @submit.prevent="submitForm">
        <div class="pb-4">
          <label 
            for="delete-pass"
            class="block pb-1 "
          >
            Enter your password to delete your account.
          </label>
          <Password
            v-model="pass" 
            input-id="delete-pass" 
            :feedback="false"
            class="block"
            fluid
          />
        </div>
        <div class="py-2 flex gap-2">
          <Button 
            type="submit"
            :loading="formLoading"
            label="Delete Account"
            severity="danger"
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