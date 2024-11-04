<script setup lang="ts">

</script>

<template>
  <div>
    <LoggedOutNavbar beta />
    <h1 class="text-5xl sm:text-6xl font-bold text-slate-800 dark:text-slate-200 py-16 text-center">
      Jobs<span class=" text-fuchsia-500">Track</span><span class="text-2xl sm:text-3xl font-normal">{{ " Beta" }}</span>
    </h1>
    <div class="flex gap-2 justify-center mx-auto pb-32">
      <Button 
        text
        label="Login"
        as="router-link"
        to="/beta/login"
        class="block"
      />
      <Button 
        text
        label="Dashboard"
        as="router-link"
        to="/beta/dashboard"
        class="block"
      />
    </div>

    <GithubLinks />
  </div>
</template>