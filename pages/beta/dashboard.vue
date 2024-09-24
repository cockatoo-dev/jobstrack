<script lang="ts" setup>
  const selectedView = ref("reminders")
  const showAddJob = ref(false)

  // const job: dashboardJobItem = {
  //   jobId: "1",
  //   companyName: "Cockatoo Co.",
  //   jobTitle: "Bird Photographer",
  //   lastUpdateType: updateTypes.ASSESS_CENTER,
  //   lastUpdateTime: Date.now(),
  //   isRemind: false,
  //   isFuture: false,
  // }
  const { data, error, refresh } = useFetch("/api/beta/dashboard")
  watch(error, async () => {
    if (error.value?.statusCode === 401) {
      await navigateTo("/beta/login")
    }
  })

  const remindersDisplay = computed(() => {
    if (!data.value) {
      return []
    } else if (data.value.futureJobs.length > 0) {
      return ["futureJobs"]
    } else if (data.value.remindJobs.length > 0) {
      return ["remindJobs"]
    } else {
      return []
    }
  })
  const stagesDisplay = computed(() => {
    const result: string[] = []
    if (!data.value) {
      return result
    }

    if (data.value.acceptJobs.length > 0) {
      result.push("offerJobs")
    }
    if (data.value.offerJobs.length > 0) {
      result.push("acceptJobs")
    }
    if (data.value.finalJobs.length > 0) {
      result.push("finalJobs")
    }
    if (data.value.interviewJobs.length > 0) {
      result.push("interviewJobs")
    }
    if (data.value.appliedJobs.length > 0) {
      result.push("appliedJobs")
    }
    if (data.value.notAppliedJobs.length > 0) {
      result.push("notAppliedJobs")
    }
    if (data.value.notConsideredJobs.length > 0) {
      result.push("notConsideredJobs")
    }

    return result
  })
</script>

<template>
  <div>
    <LoggedInNavbar :refresh-data="refresh" />
    
    <AddJobModal 
      v-model="showAddJob"
      beta
      :refresh-data="refresh"
    />

    <div class="w-[20rem] sm:w-[40rem] lg:w-[60rem] 2xl:w-[80rem] pt-4 mx-auto">
      <div class="text-lg sm:text-4xl text-slate-800 dark:text-slate-200">
        <span v-if="data && data.acceptJobs.length > 0">Congratulations!</span>
        <span v-else-if="data">Welcome back, {{ data.uname }}.</span>
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
                    :jobs="data.notConsideredJobs"
                    :refresh-data="refresh"
                  />
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
    
    <div>All Jobs</div>
    <DashboardList
      beta
      :jobs="data?.allJobs || []" 
      :refresh-data="refresh" 
    />

      <!-- <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.ACCEPT_OFFER"
        :update-time="new Date(2024,8,7).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.BEHAVE_INTERVIEW"
        :update-time="new Date(2024,8,9,10,0).getTime()"
        :is-remind="false"
        :is-future="true"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.FINAL_INTERVIEW"
        :update-time="new Date(2024,8,9,13,0).getTime()"
        :is-remind="false"
        :is-future="true"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.ASSESS_CENTER"
        :update-time="new Date(2024,8,10,13,0).getTime()"
        :is-remind="false"
        :is-future="true"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.RECEIVE_OFFER"
        :update-time="new Date(2024,8,7).getTime()"
        :is-remind="true"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.NO_APPLICATION"
        :update-time="new Date(2024,7,1).getTime()"
        :is-remind="true"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.APPLICATION_SENT"
        :update-time="new Date(2024,7,1).getTime()"
        :is-remind="true"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.ONLINE_ASSESS"
        :update-time="new Date(2024,8,1).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.INTERVIEW"
        :update-time="new Date(2024,8,4).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.PHONE_INTERVIEW"
        :update-time="new Date(2024,8,3).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.VIRTUAL_INTERVIEW"
        :update-time="new Date(2024,8,2).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.TECH_INTERVIEW"
        :update-time="new Date(2024,8,5).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.DECLINE_OFFER"
        :update-time="new Date(2024,8,7).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.REJECT"
        :update-time="new Date(2024,8,6).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        :update-type="updateTypes.WAITLIST"
        :update-time="new Date(2024,8,6).getTime()"
        :is-remind="false"
        :is-future="false"
      /> -->
  </div>
</template>