<script setup lang="ts">
  import { FetchError } from "ofetch"
  
  const loginUname = ref("")
  const loginPass = ref("")
  const createUname = ref("")
  const createPass = ref("")
  const confirmPass = ref("")
  const loginLoading = ref(false)
  const createLoading = ref(false)
  const loginError = ref("")
  const createError = ref("")

  const submitLogin = async () => {
    loginError.value = ""
    loginLoading.value = true
    try {
      await $fetch("/api/beta/auth/login", {
        method: "post",
        body: {
          uname: loginUname.value,
          pass: loginPass.value
        }
      })
      await navigateTo("/beta/dashboard")
    } catch (e) {
      loginLoading.value = false
      if (e instanceof FetchError) {
        loginError.value = e.data.message
      } else {
        throw e
      }
    }
  }
  const submitCreate = async () => {
    createError.value = ""
    createLoading.value = false
    try {
      await $fetch("/api/beta/auth/createAccount", {
        method: "post",
        body: {
          uname: createUname.value,
          pass: createPass.value,
          confirmPass: confirmPass.value
        }
      })
      await navigateTo("/beta/dashboard")
    } catch (e) {
      createLoading.value = false
      if (e instanceof FetchError) {
        createError.value = e.data.message
      } else {
        throw e
      }
    }
  }

  onMounted(async () => {
    try {
      const result = await $fetch("/api/beta/auth/tokenCheck", {method: "get"})
      if (result) {
        await navigateTo("/beta/dashboard")
      }
    } catch {
      return
    }
    
  })
</script>

<template>
  <div>
    <LoggedOutNavbar />
    <div class="p-4 mx-auto sm:w-[640px] text-slate-800 dark:text-slate-200">
      <Tabs 
        value="login"
        class="w-full"
      >
        <TabList>
          <Tab value="login">Log In</Tab>
          <Tab value="create">Create Account</Tab>
        </TabList>

        <TabPanels>
          <TabPanel value="login">
            <h2 class="py-4 text-2xl font-bold">Log in to an existing account.</h2>
            <form @submit.prevent="submitLogin">
              <div class="pb-4">
                <label 
                  for="login-username"
                  class="block pb-1 text-slate-800 dark:text-slate-200"
                >
                  Username
                </label>
                <InputText 
                  id="login-username" 
                  v-model="loginUname" 
                  class="block"
                  fluid
                />
              </div>
              <div class="pb-4">
                <label 
                  for="login-password"
                  class="block pb-1 text-slate-800 dark:text-slate-200"
                >
                  Password
                </label>
                <Password
                  id="login-password" 
                  v-model="loginPass" 
                  class="block"
                  toggle-mask
                  :feedback="false"
                  fluid
                />
              </div>

              <div class="py-2">
                <Button 
                  type="submit"
                  :loading="loginLoading"
                  fluid
                >
                  Log In
                </Button>
                <div class="pt-1 text-center text-sm text-slate-800 dark:text-slate-200">
                  When you log in, a cookie will be saved to your device which stores information used to access your account. No other cookies are used by this site.
                </div>
              </div>
              <FormError :message="loginError" />
            </form>
          </TabPanel>

          <TabPanel value="create">
            <h2 class="py-4 text-2xl font-bold">Create a new account.</h2>
            <form @submit.prevent="submitCreate">
              <div class="pb-2 text-sm text-slate-800 dark:text-slate-200">
                All fields are required.
              </div>
              <div class="pb-4">
                <label 
                  for="create-username"
                  class="block pb-1 text-slate-800 dark:text-slate-200"
                >
                  Username
                </label>
                <InputText 
                  id="create-username" 
                  v-model="createUname" 
                  class="block"
                  fluid
                  required
                />
              </div>
              <div class="pb-4">
                <label 
                  for="create-password"
                  class="block pb-1 text-slate-800 dark:text-slate-200"
                >
                  Password
                </label>
                <Password
                  id="create-password" 
                  v-model="createPass" 
                  class="block"
                  toggle-mask
                  fluid
                  required
                />
              </div>
              <div class="pb-4">
                <label 
                  for="confirm-password"
                  class="block pb-1 text-slate-800 dark:text-slate-200"
                >
                  Confirm Password
                </label>
                <Password
                  id="confirm-password" 
                  v-model="confirmPass" 
                  :feedback="false"
                  class="block"
                  fluid
                  required
                />
              </div>
              <div class="pb-2 text-red-600 dark:text-red-400 text-center font-bold">
                There is no way to recover beta accounts if the password is forgotten. Make sure to remember your password, or store it somewhere safe.
              </div>
              <div class="py-2">
                <Button 
                  type="submit"
                  :loading="createLoading"
                  fluid
                >
                  Create Account
                </Button>
                <div class="pt-1 text-center text-sm text-slate-800 dark:text-slate-200">
                  When you create an account, a cookie will be saved to your device which stores information used to access your account. No other cookies are used by this site.
                </div>
              </div>
              <FormError :message="createError" />
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>
