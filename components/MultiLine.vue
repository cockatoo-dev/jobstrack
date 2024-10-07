<script setup lang="ts">
  const props = defineProps<{
    text: string,
    lineClass?: string
  }>()

  const displayArr = computed(() => {
    return props.text.split("\n")
  })
</script>

<template>
  <div>
    <p 
      v-for="line of displayArr"
      :key="line"
      :class="lineClass || ''"
    >
      {{ line }}
    </p>
  </div>
</template>