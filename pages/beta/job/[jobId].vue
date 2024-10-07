<script setup lang="ts">
import { capitaliseFirst, timeToDaysString, updateTypes } from '~/utils/utils';

  const route = useRoute()

  const { data, error, refresh } = useFetch("/api/beta/job/getJob", {
    method: 'get',
    query: {jobId: route.params.jobId}
  })

  watch(error, async () => {
    if (error.value?.status === 403) {
      await navigateTo("/beta/login")
    }
  })
</script>

<template>
  <div>
    <LoggedInNavbar beta :refresh-data="refresh" />
    <TimeWarning :server-timestamp="data?.timestamp" />

    <div 
      class="w-full sm:w-[39rem] lg:w-[56rem] 2xl:w-[73rem] p-2 sm:p-0 mx-auto"
    >
      <Button link as="router-link" to="/beta/dashboard" label="Back to Dashboard" />
      <div v-if="data">
        <div v-if="data.isFuture" class="pb-4">
          <div class="px-2 py-1 rounded-md bg-yellow-200 dark:bg-yellow-800 text-slate-800 dark:text-slate-200">
            You have an upcoming {{ data.updates[0].updateType }} {{ timeToDaysString(data.updates[0].updateTime, data.timestamp) }}. Good luck!
          </div>
        </div>
        <div v-else-if="data.isRemind" class="pb-4">
          <div class="px-2 py-1 rounded-md bg-fuchsia-200 dark:bg-fuchsia-800 text-slate-800 dark:text-slate-200">
            <span v-if="data.updates[0].updateType === updateTypes.NO_APPLICATION">
              You haven't applied to this job yet. It's a good idea to send your application as soon as possible, then add an update here when you're done.
            </span>
            <span v-else-if="data.updates[0].updateType === updateTypes.RECEIVE_OFFER">
              You recently received an offer for this job. It's best not to dwell on your decision for too long.
            </span>
            <span v-else>
              You haven't updated this job in a while. Consider following up with the company, or add an update here if something has happened more recently.
            </span>
          </div>
        </div>
        <div
          class="px-4 py-3 rounded-2xl border-4 drop-shadow-md"
          :class="(
            data?.updates[0].updateType === updateTypes.ACCEPT_OFFER ? 'border-lime-500' : 
            data?.updates[0].updateType === updateTypes.RECEIVE_OFFER ? 'border-fuchsia-500' : 'border-slate-500'
          )"
        >
          <h2 class="text-4xl pb-2 font-bold text-slate-800 dark:text-slate-200">
            {{ data.companyName }}
          </h2>
          <div class="text-xl font-bold text-slate-800 dark:text-slate-200">
            {{ data.jobTitle }}
          </div>
          <MultiLine
            v-if="data.jobDescription !== ''"
            :text="data.jobDescription"
            class="pt-4"
            line-class="text-slate-800 dark:text-slate-200"
          />
        </div>

        <h3 class="text-2xl drop-shadow-2xl font-bold text-slate-800 dark:text-slate-200">
          Updates
        </h3>
        <div v-if="data.updates[0].updateTime === -1">
          <div class="text-lg font-bold text-slate-800 dark:text-slate-200">
            You haven't applied to this job yet.
          </div>
        </div>
        <div v-else>
          <div v-for="update of data.updates" :key="update.updateId">
            <h4 class="text-lg font-bold text-slate-800 dark:text-slate-200">
              {{ capitaliseFirst(update.updateType) }}
            </h4>
            <div class="text-slate-800 dark:text-slate-200">
              {{ capitaliseFirst(timeToDaysString(update.updateTime, data.timestamp)) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>