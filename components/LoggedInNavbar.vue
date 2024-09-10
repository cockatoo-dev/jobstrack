<script setup lang="ts">
  const props = defineProps<{
    refreshData: () => Promise<void>
  }>()
  const router = useRouter()
  
  const logout = async () => {
    try {
      await $fetch("/api/beta/auth/logout", {method: "POST"})
      router.push("/")
    } catch {
      return
    }
  }
</script>

<template>
  <div class="grid grid-cols-[1fr_auto]">
    <NuxtLink to="/">
      <div class=" text-3xl font-bold text-slate-800 dark:text-slate-200">
        Jobs<span class=" text-fuchsia-500">Track</span>
      </div>
    </NuxtLink>
    
    <div>
      <Button label="logout" @click="logout" />
    </div>
  </div>
</template>