<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
var searchInput = ""

function search() {
  router.push({
    name: "search",
    query: {"word": searchInput}
  })
}

</script>

<template>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl">

        <!-- Search Bar -->
        <div class="mt-20 sm:mt-30 lg:mt-40">
          <h2 class="text-lg font-semibold pb-4 italic">The English Language Optimized</h2>
          <input type="text" name="search" id="search" @keyup.enter="search" v-model="searchInput" class="block text-xl sm:text-2xl lg:text-4xl w-full h-12 sm:h-16 lg:h-20 rounded-lg border-gray-300 shadow-sm focus:border-[#176087] focus:ring-[#62B7E4]" placeholder="What word are we looking for?" />
        </div>

      </div>
    </div>
</template>