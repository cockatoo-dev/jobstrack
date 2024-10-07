<script setup lang="ts">
  import { updateTypes } from '#imports';
  
  const props = defineProps<{
    beta: boolean
    serverTimestamp?: number
    jobData: dashboardJobItem
    refreshData: () => Promise<void>
  }>()

  const showDismiss = ref(false)

  const notConsidered = computed(() => {
    return props.jobData.lastUpdateType === updateTypes.REJECT ||
    props.jobData.lastUpdateType === updateTypes.WAITLIST ||
    props.jobData.lastUpdateType === updateTypes.DECLINE_OFFER
  })
  const updateText = computed(() => {
    return getUpdateAction(
      props.jobData.lastUpdateType, 
      props.jobData.lastUpdateTime,
      props.serverTimestamp || Date.now()
    )
  })
</script>

<template>
  <div class="p-2">
    <div
      class="w-full max-w-64 sm:w-64 h-56 mx-auto border-4 rounded-lg drop-shadow-md transition-colors duration-300"
      :class="(
        jobData.lastUpdateType === updateTypes.ACCEPT_OFFER ? 'border-lime-500 hover:bg-lime-100 dark:hover:bg-lime-900' : 
        jobData.lastUpdateType === updateTypes.RECEIVE_OFFER ? 'border-fuchsia-500 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900' : 'border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
      )"
    >
      <NuxtLink :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`">
        <div class="w-full h-36 rounded-t py-2">
          <h2 
            class="px-2 pb-1 text-3xl font-bold line-clamp-2 overflow-ellipsis"
            :class="notConsidered ? 'text-slate-500' : 'text-slate-800 dark:text-slate-200'"
          >
            {{ jobData.companyName }}
          </h2>
          <p 
            class="px-2 font-bold line-clamp-2 overflow-ellipsis"
            :class="notConsidered ? 'text-slate-500' : 'text-slate-800 dark:text-slate-200'"
          >
          {{ jobData.jobTitle }}
        </p>
        </div>
      </NuxtLink>
      <NuxtLink
        v-if="jobData.lastUpdateType === updateTypes.ACCEPT_OFFER"
        :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`"
        class="block w-full h-[4.5rem] rounded-b p-2 bg-lime-300 dark:bg-lime-700 border-t-2 border-t-lime-300 dark:border-t-lime-700 text-slate-800 dark:text-slate-200 text-center font-bold"
      >
        {{ updateText }}
      </NuxtLink>
      <NuxtLink 
        v-else-if="jobData.isFuture"
        :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`"
        class="block w-full h-[4.5rem] rounded-b p-2 bg-yellow-300 dark:bg-yellow-700 border-t-2 border-t-yellow-300 dark:border-t-yellow-700 text-slate-800 dark:text-slate-200 font-bold text-center"
      >
        {{ updateText }}
      </NuxtLink>
      <div 
        v-else-if="jobData.isRemind"
        class="w-full h-[4.5rem] rounded-b bg-fuchsia-300 dark:bg-fuchsia-700 border-t-2 border-t-fuchsia-300 dark:border-t-fuchsia-700"
        @mouseenter="() => showDismiss = true"
        @mouseleave="() => showDismiss = false"
      >
        <div class="absolute top-36 rounded-b left-0 w-full h-[4.5rem] pt-[0.875rem] mx-auto bg-fuchsia-300 dark:bg-fuchsia-700 border-t-2 border-t-fuchsia-300 dark:border-t-fuchsia-700 transition-opacity duration-200 opacity-0 hover:opacity-100 text-center">
          <Button
            label="Dismiss Reminder"
            @click="refreshData"
          />
          
        </div>
        <div class="p-2 text-slate-800 dark:text-slate-200 font-bold text-center">
          {{ updateText }}
        </div>
      </div>

      <NuxtLink 
        v-else
        :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`"
        class="block w-full h-[4.5rem] rounded-b p-2 border-t-2 border-t-slate-500 text-center"
        :class="notConsidered ? 'text-slate-500' : 'text-slate-800 dark:text-slate-200'"
      >
        {{ updateText }}
      </NuxtLink>
    </div>
  </div>
</template>
