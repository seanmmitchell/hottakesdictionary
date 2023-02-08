<script lang="ts" setup>
import SiteNav from '../components/SiteNav.vue'
import ErrorBody from '../components/ErrorBody.vue'
import SiteFooter from '../components/SiteFooter.vue'

const props = defineProps<{
  error: {
    code: number,
    name: string,
    description?: string
  }
}>()
</script>

<template>
  <main>
    <SiteNav />
    <ErrorBody :error="props.error"/>
    <SiteFooter />
  </main>
</template>
