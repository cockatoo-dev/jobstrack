<script setup lang="ts">

</script>

<template>
  <div>
    <LoggedOutNavbar beta />
    <main class="w-full px-1 pb-16 sm:w-[39rem] lg:w-[56rem] 2xl:w-[73rem] pt-4 mx-auto text-slate-800 dark:text-slate-200">
      <h1 class="text-5xl sm:text-6xl font-bold text-slate-800 dark:text-slate-200 py-16 text-center">
        Jobs<span class=" text-fuchsia-500">Track</span><span class="text-2xl sm:text-3xl font-normal">{{ " Beta" }}</span>
      </h1>
      <div class="flex gap-2 justify-center mx-auto pb-16">
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
    </main>
    <GithubLinks />
  </div>
</template>