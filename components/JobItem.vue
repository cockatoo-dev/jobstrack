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
      class="w-full max-w-64 sm:w-64 sm:h-56 mx-auto border-4 rounded-lg transition-colors duration-300 text-slate-800 dark:text-slate-200"
      :class="(
        jobData.hasAcceptOffer ? 'border-lime-500 hover:bg-lime-100 dark:hover:bg-lime-900' : 
        jobData.updateType === updateTypes.RECEIVE_OFFER ? 'border-fuchsia-500 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900' : 'border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
      )"
    >
      <NuxtLink :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`">
        <div class="w-full sm:h-36 rounded-t py-2">
          <h3 
            class="px-2 pb-1 text-3xl font-bold line-clamp-2 overflow-ellipsis"
            :class="notConsidered ? 'text-slate-500' : ''"
          >
            {{ jobData.companyName }}
          </h3>
          <p 
            class="px-2 font-bold line-clamp-2 overflow-ellipsis"
            :class="notConsidered ? 'text-slate-500' : ''"
          >
          {{ jobData.jobTitle }}
        </p>
        </div>
      </NuxtLink>
      <NuxtLink
        v-if="jobData.hasAcceptOffer"
        :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`"
        class="block w-full sm:h-[4.5rem] rounded-b p-2 bg-lime-200 dark:bg-lime-800 border-t-2 border-t-lime-500 dark:border-t-lime-700  text-center font-bold"
      >
        {{ updateText }}
      </NuxtLink>
      <NuxtLink 
        v-else-if="jobData.isFuture"
        :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`"
        class="block w-full sm:h-[4.5rem] rounded-b p-2 bg-yellow-200 dark:bg-yellow-800 border-t-2 border-t-yellow-500  font-bold text-center"
      >
        {{ updateText }}
      </NuxtLink>
      <NuxtLink 
        v-else-if="jobData.isRemind"
        :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`"
        class="block w-full sm:h-[4.5rem] rounded-b p-2 bg-fuchsia-200 dark:bg-fuchsia-800 border-t-2 border-t-fuchsia-500  font-bold text-center"
      >
        {{ updateText }}
      </NuxtLink>

      <NuxtLink 
        v-else-if="jobData.updateType === updateTypes.RECEIVE_OFFER"
        :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`"
        class="block w-full sm:h-[4.5rem] rounded-b p-2 border-t-2 border-t-fuchsia-500  text-center"
      >
        {{ updateText }}
      </NuxtLink>

      <NuxtLink 
        v-else
        :to="`${beta ? '/beta' : ''}/job/${props.jobData.jobId}`"
        class="block w-full sm:h-[4.5rem] rounded-b p-2 border-t-2 border-t-slate-500 text-center"
        :class="notConsidered ? 'text-slate-500' : ''"
      >
        {{ updateText }}
      </NuxtLink>
    </div>
  </div>
</template>
