<script setup>
import SiteNav from '../components/SiteNav.vue'
import HomeSearch from '../components/HomeSearch.vue'
import SiteFooter from '../components/SiteFooter.vue'
</script>

<template>
  <main>
    <SiteNav />
    <div class="mt-8 sm:mt-12 lg:mt-16">
      <HomeSearch />
    </div>
    <SiteFooter />
  </main>
</template>
