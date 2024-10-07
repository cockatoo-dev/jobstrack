<script setup lang="ts">
  const isVisible = defineModel<boolean>()

  const props = defineProps<{
    beta: boolean
    refreshData: () => Promise<void>
  }>()

  const router = useRouter()

  const updateType = ref("")
  const updateTimeOption = ref("today")
  
</script>

<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    class="w-11/12 sm:w-[39rem] lg:w-[58rem] 2xl:w-[77rem]"
    header="Add Job"
  >

  </Dialog>
</template>