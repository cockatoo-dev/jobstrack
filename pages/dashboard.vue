<script lang="ts" setup>
  import { updateTypes } from '#imports';
</script>

<template>
  <div>
    <h1>Dashboard</h1>

    <div class="w-[19rem] sm:grid sm:grid-cols-2 sm:w-[38rem] lg:grid-cols-3 lg:w-[57rem] 2xl:grid-cols-4 2xl:w-[76rem] mx-auto">
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.ACCEPT_OFFER"
        :update-time="new Date(2024,8,7).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.BEHAVE_INTERVIEW"
        :update-time="new Date(2024,8,9,10,0).getTime()"
        :is-remind="false"
        :is-future="true"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.FINAL_INTERVIEW"
        :update-time="new Date(2024,8,9,13,0).getTime()"
        :is-remind="false"
        :is-future="true"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.ASSESS_CENTER"
        :update-time="new Date(2024,8,10,13,0).getTime()"
        :is-remind="false"
        :is-future="true"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.RECEIVE_OFFER"
        :update-time="new Date(2024,8,7).getTime()"
        :is-remind="true"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.NO_APPLICATION"
        :update-time="new Date(2024,7,1).getTime()"
        :is-remind="true"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.APPLICATION_SENT"
        :update-time="new Date(2024,7,1).getTime()"
        :is-remind="true"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.ONLINE_ASSESS"
        :update-time="new Date(2024,8,1).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.INTERVIEW"
        :update-time="new Date(2024,8,4).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.PHONE_INTERVIEW"
        :update-time="new Date(2024,8,3).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.VIRTUAL_INTERVIEW"
        :update-time="new Date(2024,8,2).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.TECH_INTERVIEW"
        :update-time="new Date(2024,8,5).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.DECLINE_OFFER"
        :update-time="new Date(2024,8,7).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.REJECT"
        :update-time="new Date(2024,8,6).getTime()"
        :is-remind="false"
        :is-future="false"
      />
      <JobItem
        job-id="7"
        company-name="Pigeon Consulting"
        job-title="Migration Planning and Relocation Specialist"
        update-id="8"
        :update-type="updateTypes.WAITLIST"
        :update-time="new Date(2024,8,6).getTime()"
        :is-remind="false"
        :is-future="false"
      />
    </div>
    
    
  </div>
</template>