<script setup lang="ts">
  import { FetchError } from "ofetch"
  
  const router = useRouter()
  const loginUname = ref("")
  const loginPass = ref("")
  const createUname = ref("")
  const createPass = ref("")
  const confirmPass = ref("")
  const loginError = ref("")
  const createError = ref("")

  const submitLogin = async () => {
    console.log("Log In")
    try {
      await $fetch("/api/beta/auth/login", {
        method: "post",
        body: {
          uname: loginUname.value,
          pass: loginPass.value
        }
      })
      router.push("/dashboard")
    } catch (e) {
     if (e instanceof FetchError) {
      loginError.value = e.data.message
     }
    }
  }
  const submitCreate = async () => {
    console.log("Create Account")
    try {
      await $fetch("/api/beta/auth/createAccount", {
        method: "post",
        body: {
          uname: createUname.value,
          pass: createPass.value,
          confirmPass: confirmPass.value
        }
      })
      router.push("/dashboard")
    } catch (e) {
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
        router.push("/dashboard")
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
        class="w-full sm:w-[640px]"
      >
        <TabList>
          <Tab value="login">Log In</Tab>
          <Tab value="create">Create Account</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="login">
            <h2 class="py-4 text-2xl ">Log in to an existing account</h2>
            <form @submit.prevent="submitLogin">
              <label class="block" for="login-username">Username</label>
              <div class="pb-2">
                <InputText 
                  id="login-username" 
                  v-model="loginUname" 
                />
              </div>
              <label class="block" for="login-password">Password</label>
              <div class="pb-2">
                <Password
                  id="login-password"
                  v-model="loginPass"
                  :feedback="false"
                />
              </div>
              <div class="pt-2">
                <Button 
                  type="submit"
                >
                  Log In
                </Button>
              </div>
              <div>{{ loginError }}</div>
            </form>
          </TabPanel>
          <TabPanel value="create">
            <h2 class="py-4 text-2xl">Create a new account</h2>
            <form @submit.prevent="submitCreate">
              <div class="pb-2">
                <label class="block" for="create-username">Username</label>
                <InputText 
                  id="create-username" 
                  v-model="createUname" 
                />
              </div>
              <label class="block" for="create-password">Password</label>
              <div class="pb-2">
                <Password
                  id="create-password"
                  v-model="createPass"
                  :feedback="true"
                />
              </div>
              <label class="block" for="confirm-password">Confirm Password</label>
              <div class="pb-2">
                <Password
                  id="confirm-password"
                  v-model="confirmPass"
                  :feedback="false"
                />
              </div>
              <div class="pt-2">
                <Button 
                  type="submit"
                >
                  Log In
                </Button>
              </div>
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>
