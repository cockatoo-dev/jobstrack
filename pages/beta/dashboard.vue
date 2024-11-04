<script lang="ts" setup>
  const showAddJob = ref(false)
  const showJobLimit = ref(false)

  const { data, error, refresh } = useFetch("/api/beta/dashboard")
  watch(error, async () => {
    if (error.value?.statusCode === 403) {
      await navigateTo("/beta/login")
    }
  })

  const checkedTime = useCheckedTime(data)

  const selectedView = ref("reminders")
  const remindersDisplay = ref<string[]>([])
  const stagesDisplay = ref<string[]>([])

  watch(data, () => {
    if (!data.value) {
      return
    }

    if (data.value.acceptJobs.length > 0) {
      selectedView.value = "stages"
    } else {
      selectedView.value = "reminders"
    }
  })

  watch(data, () => {
    if (!data.value) {
      remindersDisplay.value = []
      stagesDisplay.value = []
      return
    } 
    
    if (data.value.futureJobs.length > 0) {
      remindersDisplay.value = ["futureJobs"]
    } else if (data.value.remindJobs.length > 0) {
      remindersDisplay.value = ["remindJobs"]
    } else {
      remindersDisplay.value = []
    }

    const stages: string[] = []
    if (data.value.acceptJobs.length > 0) {
      stages.push("acceptJobs")
    }
    if (data.value.offerJobs.length > 0) {
      stages.push("offerJobs")
    }
    if (data.value.finalJobs.length > 0) {
      stages.push("finalJobs")
    }
    if (data.value.interviewJobs.length > 0) {
      stages.push("interviewJobs")
    }
    if (data.value.appliedJobs.length > 0) {
      stages.push("appliedJobs")
    }
    if (data.value.notAppliedJobs.length > 0) {
      stages.push("notAppliedJobs")
    }
    if (data.value.notConsideredJobs.length > 0) {
      stages.push("notConsideredJobs")
    }
    stagesDisplay.value = stages
  })
</script>

<template>
  <div>
    <LoggedInNavbar beta :refresh-data="refresh" />
    <TimeWarning :server-timestamp="data?.timestamp" />
    
    <AddJobModal 
      v-model="showAddJob"
      beta
      :refresh-data="refresh"
    />

    <Dialog
      v-model:visible="showJobLimit"
      modal
      class="w-11/12 sm:w-[37rem]"
    >
      <template #container>
        <div class="p-4 text-slate-800 dark:text-slate-200">
          <div class=" text-xl font-bold">
            Job limit reached.
          </div>
          <div class="">
            You've reached the maximum number of jobs for your account.
            Consider deleting a job which you are no longer considering, then return here to add a new job.
          </div>
          <div class="pt-2">
            <Button 
              type="button"
              text
              label="Cancel"
              autofocus
              class="block"
              @click="() => {showJobLimit = false}"
            />
          </div>
        </div>
      </template>
    </Dialog>

    <main class="w-full px-1 sm:w-[39rem] lg:w-[56rem] 2xl:w-[73rem] pt-4 mx-auto text-slate-800 dark:text-slate-200">
      <div v-if="data">
        <h1 v-if="data.acceptJobs.length > 0" class="text-2xl sm:text-4xl pb-1">
          Congratulations!
        </h1>
        <h1 v-else class="text-2xl sm:text-4xl pb-1">
          Welcome back, {{ data.username }}
        </h1>

        <Tabs v-model:value="selectedView">
          <TabList>
            <Tab value="reminders">Reminders</Tab>
            <Tab value="stages">Stages</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="reminders">
              <Accordion
                :value="remindersDisplay"
                multiple
              >
                <AccordionPanel
                  v-if="data && data.futureJobs.length > 0"
                  value="futureJobs"
                >
                  <AccordionHeader>Upcoming Events</AccordionHeader>
                  <AccordionContent class="px-0">
                    <DashboardList 
                      beta
                      :timestamp="checkedTime"
                      :jobs="data.futureJobs"
                      :refresh-data="refresh"
                    />
                  </AccordionContent>
                </AccordionPanel>

                <AccordionPanel
                  v-if="data && data.remindJobs.length > 0"
                  value="remindJobs"
                >
                  <AccordionHeader>Reminders</AccordionHeader>
                  <AccordionContent class="px-0">
                    <DashboardList 
                      beta
                      :timestamp="checkedTime"
                      :jobs="data.remindJobs"
                      :refresh-data="refresh"
                    />
                  </AccordionContent>
                </AccordionPanel>
              </Accordion>

              <div
                v-if="data.futureJobs.length === 0 && data.remindJobs.length === 0"
                class="py-4 text-center text-2xl font-bold text-slate-800 dark:text-slate-200"
              >
                No reminders.
              </div>
            </TabPanel>

            <TabPanel value="stages">
              <Accordion
                :value="stagesDisplay"
                multiple
              >
                <AccordionPanel
                  v-if="data && data.acceptJobs.length > 0"
                  value="acceptJobs"
                >
                  <AccordionHeader>Accepted Offers</AccordionHeader>
                  <AccordionContent>
                    <DashboardList 
                      beta
                      :timestamp="checkedTime"
                      :jobs="data.acceptJobs"
                      :refresh-data="refresh"
                    />
                  </AccordionContent>
                </AccordionPanel>

                <AccordionPanel
                  v-if="data && data.offerJobs.length > 0"
                  value="offerJobs"
                >
                  <AccordionHeader>Received Offers</AccordionHeader>
                  <AccordionContent>
                    <DashboardList 
                      beta
                      :timestamp="checkedTime"
                      :jobs="data.offerJobs"
                      :refresh-data="refresh"
                    />
                  </AccordionContent>
                </AccordionPanel>

                <AccordionPanel
                  v-if="data && data.finalJobs.length > 0"
                  value="finalJobs"
                >
                  <AccordionHeader>Final Interviews, Assessment Centers</AccordionHeader>
                  <AccordionContent>
                    <DashboardList 
                      beta
                      :timestamp="checkedTime"
                      :jobs="data.finalJobs"
                      :refresh-data="refresh"
                    />
                  </AccordionContent>
                </AccordionPanel>

                <AccordionPanel
                  v-if="data && data.interviewJobs.length > 0"
                  value="interviewJobs"
                >
                  <AccordionHeader>Interviews, Online Assessments</AccordionHeader>
                  <AccordionContent>
                    <DashboardList 
                      beta
                      :timestamp=checkedTime
                      :jobs="data.interviewJobs"
                      :refresh-data="refresh"
                    />
                  </AccordionContent>
                </AccordionPanel>

                <AccordionPanel
                  v-if="data && data.appliedJobs.length > 0"
                  value="appliedJobs"
                >
                  <AccordionHeader>Applications Sent</AccordionHeader>
                  <AccordionContent>
                    <DashboardList 
                      beta
                      :timestamp="checkedTime"
                      :jobs="data.appliedJobs"
                      :refresh-data="refresh"
                    />
                  </AccordionContent>
                </AccordionPanel>

                <AccordionPanel
                  v-if="data && data.notAppliedJobs.length > 0"
                  value="notAppliedJobs"
                >
                  <AccordionHeader>Applications Not Sent</AccordionHeader>
                  <AccordionContent>
                    <DashboardList 
                      beta
                      :timestamp="checkedTime"
                      :jobs="data.notAppliedJobs"
                      :refresh-data="refresh"
                    />
                  </AccordionContent>
                </AccordionPanel>

                <AccordionPanel
                  v-if="data && data.notConsideredJobs.length > 0"
                  value="notConsideredJobs"
                >
                  <AccordionHeader>No Longer Considered</AccordionHeader>
                  <AccordionContent>
                    <DashboardList 
                      beta
                      :timestamp="checkedTime"
                      :jobs="data.notConsideredJobs"
                      :refresh-data="refresh"
                    />
                  </AccordionContent>
                </AccordionPanel>
              </Accordion>
              <div
                v-if="data.allJobs.length === 0"
                class="py-4 text-center text-2xl font-bold text-slate-800 dark:text-slate-200"
              >
                No jobs.
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <div class="grid grid-cols-[1fr_auto] pt-2">
          <h3 class="text-2xl font-bold ">All Jobs</h3>
          <Button 
            class="block"
            label="Add Job"
            @click="() => {
              if (data && data.allJobs.length >= limits.JOB_LIMIT) {
                showJobLimit = true
              } else {
                showAddJob = true
              }
            }"
          />
        </div>
        <div v-if="data.allJobs.length > 0">
          <DashboardList
            beta
            search
            :timestamp="checkedTime"
            :jobs="data?.allJobs || []" 
            :refresh-data="refresh" 
          />
        </div>
        <div v-else class="py-4 text-center text-2xl font-bold ">
          Click 'Add Job' above to add your first job.
        </div>
      </div>

      <DataLoadingError v-else-if="error" />
      <DataLoading v-else />
    </main>

    <GithubLinks />
  </div>
</template>