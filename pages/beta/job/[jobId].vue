<script setup lang="ts">

  const route = useRoute()
  const showMobileOptions = ref(false)
  const showEditJob = ref(false)
  const remindLoading = ref(false)
  const showDeleteJob = ref(false)
  const showAddUpdate = ref(false)
  const showUpdateLimit = ref(false)
  const showDeleteUpdate = ref(false)
  const deleteUpdateId = ref("")

  const { data, error, refresh } = useFetch("/api/beta/job/getJob", {
    method: 'get',
    query: {jobId: route.params.jobId}
  })

  const lastUpdateType = computed(() => {
    if (!data.value) {
      return updateTypes.NO_APPLICATION
    }

    if (data.value.hasAcceptOffer) {
      return updateTypes.ACCEPT_OFFER
    } else if (data.value.updates.length === 0) {
      return updateTypes.NO_APPLICATION
    } else {
      return data.value.updates[0].updateType
    }
  })

  const checkedTime = useCheckedTime(data)

  watch(error, async () => {
    if (error.value?.status === 403) {
      await navigateTo("/beta/login")
    }
  })

  const setDismissRemind = async (dismissRemind: boolean) => {
    remindLoading.value = true
    try {
      await $fetch("/api/beta/job/setReminder", {
        method: "post",
        body: {
          jobId: route.params.jobId,
          dismissRemind
        }
      })
      await refresh()
    } finally {
      remindLoading.value = false
    }
  }


</script>

<template>
  <div>
    <LoggedInNavbar beta :refresh-data="refresh" />
    <TimeWarning :server-timestamp="data?.timestamp" />

    <EditJobModal 
      v-model="showEditJob"
      beta
      :job-id="route.params.jobId"
      :current-company-name="data?.companyName || ''"
      :current-job-title="data?.jobTitle || ''"
      :current-job-description="data?.jobDescription || ''"
      :refresh-data="refresh"
    />

    <DeleteJobModal 
      v-model="showDeleteJob"
      beta
      :job-id="route.params.jobId"
    />
    
    <AddUpdateModal 
      v-model="showAddUpdate"
      beta
      :timestamp="checkedTime"
      :job-id="route.params.jobId"
      :last-update-type="lastUpdateType"
      :refresh-data="refresh"
    />

    <DeleteUpdateModal 
      v-model="showDeleteUpdate"
      beta
      :job-id="route.params.jobId"
      :update-id="deleteUpdateId"
      :refresh-data="refresh"
    />
    
    <Dialog
      v-model:visible="showUpdateLimit"
      modal
      class="w-11/12 sm:w-[37rem]"
    >
      <template #container>
        <div class="p-4">
          <div class="text-slate-800 dark:text-slate-200 text-xl font-bold">
            Update limit reached.
          </div>
          <div class="text-slate-800 dark:text-slate-200">
            You've reached the maximum number of updates for this job. 
            When you create a new update for this job, the oldest update for this job will be deleted.
          </div>
          <div class="pt-2 flex gap-2">
            <Button 
              type="button"
              label="Proceed"
              class="block"
              @click="() => {
                showUpdateLimit = false
                showAddUpdate = true
              }"
            />
            <Button 
              type="button"
              text
              label="Cancel"
              class="block"
              @click="() => {showUpdateLimit = false}"
            />
          </div>
        </div>
      </template>
    </Dialog>

    <div 
      class="w-full sm:w-[39rem] lg:w-[56rem] 2xl:w-[73rem] p-2 sm:p-0 mx-auto"
    >
      <Button text as="router-link" to="/beta/dashboard" label="Back to Dashboard" />
      <div v-if="data" class="pt-2">
        <div v-if="data.isFuture && data.futureCount > 1" class="pb-2">
          <div class="px-2 py-1 rounded-lg bg-yellow-200 dark:bg-yellow-800 text-slate-800 dark:text-slate-200">
            You have {{ data.futureCount }} upcoming events. Good luck!
          </div>
        </div>
        <div v-else-if="data.isFuture && data.updates.length > 0" class="pb-2">
          <div class="px-2 py-1 rounded-lg bg-yellow-200 dark:bg-yellow-800 text-slate-800 dark:text-slate-200">
            You have an upcoming {{ data.updates[0].updateType }} {{ timeToDaysString(data.updates[0].updateTime, checkedTime) }}. Good luck!
          </div>
        </div>
        <div v-else-if="data.isRemind" class="pb-2">
          <div class="px-2 py-1 rounded-lg bg-fuchsia-200 dark:bg-fuchsia-800 text-slate-800 dark:text-slate-200">
            <span v-if="lastUpdateType === updateTypes.NO_APPLICATION">
              You haven't applied to this job yet. It's a good idea to send your application as soon as possible, then add an update here when you're done.
            </span>
            <span v-else-if="lastUpdateType === updateTypes.RECEIVE_OFFER">
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
            data.hasAcceptOffer ? 'border-lime-500' : 
            lastUpdateType === updateTypes.RECEIVE_OFFER ? 'border-fuchsia-500' : 'border-slate-500'
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

        <div class="block sm:hidden pt-2">
          <Button 
            type="button"
            text
            label="Options"
            class="block"
            @click="() => {showMobileOptions = true}"
          />
        </div>
        <div class="hidden sm:flex sm:gap-2 pt-2">
          <div>
            <Button 
              v-if="data.dismissRemind"
              type="button"
              label="Turn On Reminders"
              class="block"
              :loading="remindLoading"
              @click="() => {setDismissRemind(false)}"
            />
            <Button 
              v-else
              type="button"
              text
              label="Turn Off Reminders"
              class="block"
              :loadkg="remindLoading"
              @click="() => {setDismissRemind(true)}"
            />
          </div>
          <Button 
            type="button"
            text
            label="Edit Job"
            class="block"
            :loadkg="remindLoading"
            @click="() => {showEditJob = true}"
          />
          <Button 
            type="button"
            text
            label="Delete Job"
            class="block"
            severity="danger"
            @click="() => {showDeleteJob = true}"
          />
        </div>
        <Dialog
          v-model:visible="showMobileOptions"
          modal
          class="w-11/12 sm:w-[37rem]"
        >
          <template #container>
            <div class="px-2 pt-2 grid grid-cols-[1fr_auto]">
              <div class="pt-2 pl-3 font-bold text-xl text-slate-800 dark:text-slate-200">Job Options</div>
              <div>
                <Button 
                  text
                  label="Close"
                  @click="() => {showMobileOptions = false}"
                />
              </div>
            </div>
            <nav class="p-2 text-left">
              <div>
                <Button 
                  v-if="data && data.dismissRemind"
                  type="button"
                  label="Turn On Reminders"
                  class="block"
                  :loading="remindLoading"
                  @click="() => {setDismissRemind(false).then(() => showMobileOptions = false)}"
                />
                <Button 
                  v-else
                  type="button"
                  text
                  label="Turn Off Reminders"
                  class="block"
                  :loadkg="remindLoading"
                  @click="() => {setDismissRemind(true).then(() => showMobileOptions = false)}"
                />
              </div>
              <div>
                <Button 
                  text 
                  label="Edit Job" 
                  @click="() => {
                    showMobileOptions = false
                    showEditJob = true
                  }" 
                />
              </div>
              <div>
                <Button 
                  text 
                  label="Delete Job"
                  severity="danger"
                  @click="() => {
                    showMobileOptions = false
                    showDeleteJob = true
                  }"
                />
              </div>
            </nav>
          </template>
        </Dialog>

        <div 
          v-if="lastUpdateType === updateTypes.ACCEPT_OFFER"
          class="pt-2"
        >
          <h3 class="pt-2 pb-1 text-2xl drop-shadow-2xl font-bold text-slate-800 dark:text-slate-200">
            Updates
          </h3>
        </div>
        <div v-else class="grid grid-cols-[1fr_auto] pt-2">
          <h3 class="pt-2 pb-1 text-2xl drop-shadow-2xl font-bold text-slate-800 dark:text-slate-200">
            Updates
          </h3>
          <Button 
            label="Add Update"
            class="block font-bold"
            @click="() => {
              showUpdateLimit = true
            }"
          />
        </div>
        
        <div v-if="lastUpdateType === updateTypes.NO_APPLICATION">
          <div class="text-lg font-bold text-slate-800 dark:text-slate-200">
            You haven't applied to this job yet.
          </div>
        </div>
        <div v-else class="pt-2">
          <div v-for="update of data.updates" :key="update.updateId" class="pb-2">
            <div class="grid grid-cols-[1fr_auto] pt-1 border-t-2 border-slate-200 dark:border-slate-800">
              <h4 class="py-2 text-lg font-bold text-slate-800 dark:text-slate-200">
                {{ capitaliseFirst(update.updateType) }}
              </h4>
              <Button 
                type="button"
                text
                label="Delete"
                class="block"
                severity="danger"
                @click="() => {
                  deleteUpdateId = update.updateId
                  showDeleteUpdate = true
                }"
              />
            </div>
            
            <div class="pb-2 text-slate-800 dark:text-slate-200">
              {{ capitaliseFirst(timeToDaysString(update.updateTime, checkedTime)) }}
            </div>
            <div v-if="update.updateNotes" class="pb-2">
              <MultiLine 
                :text="update.updateNotes"
                line-class="text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>