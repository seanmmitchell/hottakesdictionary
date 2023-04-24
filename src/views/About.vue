<script setup>
import SiteNav from '../components/SiteNav.vue'
import QuickStats from '../components/QuickStats.vue'
import SiteFooter from '../components/SiteFooter.vue'
</script>

<template>
  <main>
    <SiteNav />
    <QuickStats />

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What is Hot Takes Dictionary?</h1>
          <div class="mt-10 max-w-xl text-base leading-7 text-gray-700">
            <div>
              <p>Hot Takes Dictionary (HTD) was a project made as a joke for searching made-up english words. While the premise of it is foolish it was a great use-case to practice with some additions to Cloudflare's Developer products!</p>
              <p class="mt-8">This product leverages Pages, Pages with Functions (Workers), and KV.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SiteFooter />
  </main>
</template>
