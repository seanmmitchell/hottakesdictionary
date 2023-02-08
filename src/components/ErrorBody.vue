<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const props = defineProps<{
  error: {
    code: number,
    name: string,
    description?: string
  }
}>()
</script>

<template>
  <div v-if="props.error != undefined" class="min-h-full bg-auto bg-no-repeat bg-[url('https://imagedelivery.net/EydYE-PtDpAM2fFrVpFAag/d8d24e43-a5be-4b5f-30c0-babc2003dd00/public')]">
    <div class="mx-auto max-w-7xl py-16 px-6 text-center sm:py-24 lg:px-8 lg:py-48">
      <h1 class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">{{ error.code }}: {{ error.name }}</h1>
      <p class="mt-2 text-lg font-medium text-black text-opacity-50">{{ error.description }}</p>
      <div class="mt-6">
        <router-link :to="{name: 'home'}" class="inline-flex items-center rounded-md border border-transparent bg-white bg-opacity-75 px-4 py-2 text-sm font-medium text-black text-opacity-75 sm:bg-opacity-25 sm:hover:bg-opacity-50">Back to Search</router-link>
      </div>
    </div>
  </div>
</template>