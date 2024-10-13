<script setup lang="ts">
  import { FetchError } from 'ofetch'
  
  const props = defineProps<{
    beta?: boolean
    refreshData: () => Promise<void>
  }>()
  
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
  <div class="grid grid-cols-[1fr_auto_auto] w-full sm:w-[39rem] lg:w-[56rem] 2xl:w-[73rem] mx-auto px-2 py-1">
    <NavLogo :beta />
    <div>
      <Button link label="User Settings" @click="alertFunction" />
    </div>
    <div>
      <Button link label="Logout" @click="logout" />
    </div>
  </div>
</template>