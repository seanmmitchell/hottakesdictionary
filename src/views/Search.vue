<script setup>
import SiteNav from '../components/SiteNav.vue'
import HomeSearch from '../components/HomeSearch.vue'
import ResultInfo from '../components/ResultInfo.vue'
import SiteFooter from '../components/SiteFooter.vue'
</script>

<template>
  <main>
    <SiteNav />
    <div class="mt-4 sm:mt-8 lg:mt-12">
      <HomeSearch />
    </div>
    <ResultInfo />
    <SiteFooter />
  </main>
</template>
