<script lang="ts" setup>
  const showAddJob = ref(false)

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

    <div class="w-full px-1 sm:w-[39rem] lg:w-[56rem] 2xl:w-[73rem] pt-4 mx-auto">
      <div class="text-lg sm:text-4xl pb-1 text-slate-800 dark:text-slate-200">
        <span v-if="data && data.acceptJobs.length > 0">Congratulations!</span>
        <span v-else-if="data">Welcome back, {{ data.username }}.</span>
      </div>
      
      <Tabs v-model:value="selectedView">
        <div class="grid grid-cols-[1fr_auto]">
          <TabList>
            <Tab value="reminders">Reminders</Tab>
            <Tab value="stages">Stages</Tab>
          </TabList>
          <div class="pl-2">
            <Button 
              class="block h-full !font-bold"
              label="Add Job"
              @click="() => showAddJob = true"
            >
              <div class="font-bold">
                Add Job
              </div>
            </Button>
          </div>
        </div>
        
        <TabPanels>
          <TabPanel value="reminders">
            Reminders view
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
          </TabPanel>

          <TabPanel value="stages">
            Stages view
            <Accordion
              :value="stagesDisplay"
              multiple
            >
              <AccordionPanel
                v-if="data && data.acceptJobs.length > 0"
                value="acceptJobs"
              >
                <AccordionHeader>Accepted Offer</AccordionHeader>
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
          </TabPanel>
        </TabPanels>
      </Tabs>

      <div v-if="data">
        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200">All Jobs</h3>
        <DashboardList
          beta
          :timestamp="checkedTime"
          :jobs="data?.allJobs || []" 
          :refresh-data="refresh" 
        />
      </div>
    </div>
  </div>
</template>