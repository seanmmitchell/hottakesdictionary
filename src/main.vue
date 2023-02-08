<script lang="ts" setup>
import { onMounted } from 'vue'
import {  useRouter, RouterView } from 'vue-router'

const router = useRouter()

console.dir(document)

onMounted(() => {
  router.afterEach((to, from) => {
    if (to.meta != undefined) {
      const newTitle: string =  to.meta.title as string;
      document.title = newTitle;
    }
  });
})
</script>

<template>
  <RouterView />
</template>
