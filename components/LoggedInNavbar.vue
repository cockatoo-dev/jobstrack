<script setup lang="ts">
  import { FetchError } from 'ofetch'
  
  const props = defineProps<{
    beta?: boolean
    refreshData: () => Promise<void>
  }>()

  const showMobileNav = ref(false)
  
  const alertFunction = () => {
    alert(1)
  }
  
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
  <nav class="grid grid-cols-[1fr_auto] sm:hidden w-full">
    <NavLogo :beta="!showMobileNav" />
    <div>
      <Button link label="Menu" @click="() => {showMobileNav = true}" />
    </div>
  </nav>
  <Dialog
    v-model:visible="showMobileNav"
    modal
    class="w-11/12"
  >
    <template #container>
      <div class="px-2 pt-2 grid grid-cols-[1fr_auto]">
        <div class="pt-2 pl-3 font-bold text-xl text-slate-800 dark:text-slate-200">Menu</div>
        <div>
          <Button 
            label="Close"
            @click="() => {showMobileNav = false}"
          />
        </div>
      </div>
      <nav class="p-2 text-left">
        <div>
          <Button link label="User Settings" @click="alertFunction" />
        </div>
        <div>
          <Button link label="Logout" @click="logout" />
        </div>
      </nav>
    </template>
  </Dialog>
  <nav class="hidden sm:grid sm:grid-cols-[1fr_auto_auto] w-full sm:w-[39rem] lg:w-[56rem] 2xl:w-[73rem] mx-auto px-2 py-1">
    <NavLogo :beta />
    <div>
      <Button link label="User Settings" @click="alertFunction" />
    </div>
    <div>
      <Button link label="Logout" @click="logout" />
    </div>
  </nav>
</template>