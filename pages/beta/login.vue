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
    createLoading.value = true
    if (createPass.value !== confirmPass.value) {
      createError.value = "Passwords do not match."
      createLoading.value = false
      return
    }
    createError.value = ""
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
    <LoggedOutNavbar beta />
    <main class="p-4 mx-auto sm:w-[40rem]">
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
            <div class="text-slate-800 dark:text-slate-200">
              <h2 class="py-4 text-3xl font-bold ">Log in to an existing account.</h2>
              <form @submit.prevent="submitLogin">
                <div class="pb-4">
                  <label 
                    for="login-username"
                    class="block pb-1 "
                  >
                    Username
                  </label>
                  <InputText 
                    v-model="loginUname"
                    input-id="login-username" 
                    class="block"
                    fluid
                  />
                </div>
                <div class="pb-4">
                  <label 
                    for="login-password"
                    class="block pb-1 "
                  >
                    Password
                  </label>
                  <Password
                    v-model="loginPass" 
                    input-id="login-password" 
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
                    label="Log In"
                    class="block"
                    fluid
                  />
                  <div class="pt-1 text-center text-sm ">
                    When you log in, a cookie will be saved to your device which stores information used to access your account. No other cookies are used by this site.
                  </div>
                </div>
                <FormError :message="loginError" />
              </form>
            </div>
          </TabPanel>

          <TabPanel value="create">
            <div class="text-slate-800 dark:text-slate-200">
              <h2 class="py-4 text-3xl font-bold">Create a new account.</h2>
              <form @submit.prevent="submitCreate">
                <div class="pb-2 text-sm ">
                  All fields are required.
                </div>
                <div class="pb-4">
                  <label 
                    for="create-username"
                    class="block pb-1 "
                  >
                    Username
                  </label>
                  <InputText 
                    v-model="createUname"
                    input-id="create-username"  
                    class="block"
                    fluid
                    required
                  />
                </div>
                <div class="pb-4">
                  <label 
                    for="create-password"
                    class="block pb-1 "
                  >
                    Password
                  </label>
                  <Password
                    v-model="createPass"
                    input-id="create-password"  
                    class="block"
                    toggle-mask
                    fluid
                    required
                  />
                </div>
                <div class="pb-4">
                  <label 
                    for="confirm-password"
                    class="block pb-1 "
                  >
                    Confirm Password
                  </label>
                  <Password
                    v-model="confirmPass" 
                    input-id="confirm-password" 
                    :feedback="false"
                    class="block"
                    fluid
                    required
                  />
                </div>
                <p class="pb-2 text-red-600 dark:text-red-400 text-center font-bold">
                  There is no way to recover beta accounts if the password is forgotten. Make sure to remember your password, or store it somewhere safe.
                </p>
                <div class="py-2">
                  <Button 
                    type="submit"
                    :loading="createLoading"
                    label="Create Account"
                    class="block"
                    fluid
                  />
                  <p class="pt-1 text-center text-sm ">
                    When you create an account, a cookie will be saved to your device which stores information used to access your account. No other cookies are used by this site.
                  </p>
                </div>
                <FormError :message="createError" />
              </form>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </main>
  </div>
</template>
