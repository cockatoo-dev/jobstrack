<script setup lang="ts">
  import { updateTypes } from '#imports';
  
  const props = defineProps<{
    beta?: boolean
    timestamp: number
    jobData: dashboardJobItem
    refreshData: () => Promise<void>
  }>()

  const notConsidered = computed(() => {
    return props.jobData.updateType === updateTypes.REJECT ||
    props.jobData.updateType === updateTypes.WAITLIST ||
    props.jobData.updateType === updateTypes.DECLINE_OFFER
  })
  const updateText = computed(() => {
    return getUpdateAction(
      props.jobData.updateType, 
      props.jobData.updateTime,
      props.timestamp,
      props.jobData.hasAcceptOffer ? 0 : props.jobData.futureCount
    )
  })
</script>

<template>
  <div class="p-2">
    <div
      class="w-full max-w-64 sm:w-64 sm:h-56 mx-auto border-4 rounded-lg transition-colors duration-300"
      :class="(
        jobData.hasAcceptOffer ? 'border-lime-500 hover:bg-lime-100 dark:hover:bg-lime-900' : 
        jobData.updateType === updateTypes.RECEIVE_OFFER ? 'border-fuchsia-500 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900' : 'border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
      )"
    >
      <NuxtLink :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`">
        <div class="w-full sm:h-36 rounded-t py-2">
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
        v-if="jobData.hasAcceptOffer"
        :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`"
        class="block w-full sm:h-[4.5rem] rounded-b p-2 bg-lime-300 dark:bg-lime-700 border-t-2 border-t-lime-300 dark:border-t-lime-700 text-slate-800 dark:text-slate-200 text-center font-bold"
      >
        {{ updateText }}
      </NuxtLink>
      <NuxtLink 
        v-else-if="jobData.isFuture"
        :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`"
        class="block w-full sm:h-[4.5rem] rounded-b p-2 bg-yellow-300 dark:bg-yellow-700 border-t-2 border-t-yellow-300 dark:border-t-yellow-700 text-slate-800 dark:text-slate-200 font-bold text-center"
      >
        {{ updateText }}
      </NuxtLink>
      <NuxtLink 
        v-else-if="jobData.isRemind"
        :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`"
        class="block w-full sm:h-[4.5rem] rounded-b bg-fuchsia-300 dark:bg-fuchsia-700 border-t-2 border-t-fuchsia-300 dark:border-t-fuchsia-700"
      >
        <div class="p-2 text-slate-800 dark:text-slate-200 font-bold text-center">
          {{ updateText }}
        </div>
      </NuxtLink>

      <NuxtLink 
        v-else
        :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`"
        class="block w-full sm:h-[4.5rem] rounded-b p-2 border-t-2 border-t-slate-500 text-center"
        :class="notConsidered ? 'text-slate-500' : 'text-slate-800 dark:text-slate-200'"
      >
        {{ updateText }}
      </NuxtLink>
    </div>
  </div>
</template>
