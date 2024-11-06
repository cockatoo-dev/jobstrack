<script setup lang="ts">
  import { FetchError } from 'ofetch'
  
  const props = defineProps<{
    beta?: boolean
    refreshData: () => Promise<void>
  }>()

  const showMobileNav = ref(false)
  const showUserSettings = ref(false)
  
  const logout = async () => {
    try {
      if (props.beta) {
        await $fetch("/api/beta/auth/logout", {method: "POST"})
      }
      
      await navigateTo("/")
    } catch (e) {
      if (e instanceof FetchError) {
        return
      } else {
        throw e
      }
    }
  }
</script>

<template>
  <div>
    <BetaUserSettingsModal 
      v-if="beta"
      v-model="showUserSettings"
      :refresh-data
    />
  </div>
  
  <nav class="grid grid-cols-[1fr_auto] sm:hidden w-full px-2 py-1">
    <NavLogo :beta />
    <div>
      <Button text label="Menu" @click="() => {showMobileNav = true}" />
    </div>
  </nav>
  <Dialog
    v-model:visible="showMobileNav"
    modal
    class="w-11/12 sm:w-[37rem]"
  >
    <template #container>
      <div class="px-2 pt-2 grid grid-cols-[1fr_auto]">
        <h3 class="pt-2 pl-3 font-bold text-xl text-slate-800 dark:text-slate-200">Menu</h3>
        <div>
          <Button 
            text
            label="Close"
            @click="() => {showMobileNav = false}"
          />
        </div>
      </div>
      <nav class="p-2 text-left">
        <div class="pt-2">
          <Button 
            text 
            label="User Settings"
            autofocus
            fluid
            @click="() => {
              showMobileNav = false
              showUserSettings = true
            }" 
          >
            <div class="w-full text-left">User Settings</div>
          </Button>
        </div>
        <div class="pt-2">
          <Button 
            text 
            label="Logout" 
            fluid
            @click="() => {
              showMobileNav = false
              logout()
            }"
          >
            <div class="w-full text-left">Logout</div>
          </Button>
        </div>
      </nav>
    </template>
  </Dialog>
  <nav class="hidden sm:grid sm:grid-cols-[1fr_auto_auto] w-full sm:w-[39rem] lg:w-[56rem] 2xl:w-[73rem] mx-auto px-2 py-1">
    <NavLogo :beta />
    <div class="pl-2">
      <Button text label="User Settings" @click="() => {showUserSettings = true}" />
    </div>
    <div class="pl-2">
      <Button text label="Logout" @click="logout" />
    </div>
  </nav>
</template>