<script lang="ts" setup>
  const router = useRouter()
  
  const selectedView = ref("reminders")
  const showAddJob = ref(false)

  const job: dashboardJobItem = {
    jobId: "1",
    companyName: "Cockatoo Co.",
    jobTitle: "Bird Photographer",
    lastUpdateType: updateTypes.ASSESS_CENTER,
    lastUpdateTime: Date.now(),
    isRemind: false,
    isFuture: false,
  }
  const { data, error, status, refresh } = useFetch("/api/beta/dashboard")
  watch(status, () => {
    console.log("Fetch status updated!: ", status.value)
    if (error.value?.statusCode === 401) {
      router.push("/login")
    }
  })
</script>

<template>
  <div>
    <LoggedInNavbar :refresh-data="refresh" />
    <div v-if="data && data.acceptJobs.length > 0">Congratulations!</div>
    <div v-else-if="data">Welcome back, {{ data.uname }}.</div>
    <div>{{ showAddJob }}</div>

    <AddJobModal 
      v-model="showAddJob"
      :refresh-data="refresh"
    />
    <Tabs
      v-model:value="selectedView"
      class="w-[20rem] sm:w-[40rem] lg:w-[60rem] 2xl:w-[80rem] mx-auto"
    >
      <div class="grid grid-cols-[1fr_auto]">
        <TabList>
          <Tab value="reminders">Reminders</Tab>
          <Tab value="stages">Stages</Tab>
        </TabList>
        <div>
          <Button 
            label="Add Job"
            @click="() => showAddJob = true"
          />
        </div>
      </div>
      
      <TabPanels>
        <TabPanel value="reminders">
          Reminders view
          <!-- <Accordion>
            
          </Accordion> -->
        </TabPanel>
        <TabPanel value="stages">
          Stages view
        </TabPanel>
      </TabPanels>
    </Tabs>
    <DashboardList :jobs="[job]" :refresh-data="refresh" />

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