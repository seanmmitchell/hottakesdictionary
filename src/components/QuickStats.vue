<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router'

export default {
  setup() {
    const awaitingQuery = ref(true);
    const queryError = ref('');
    const queryResults = ref({});

    const stats = ref([
      { name: 'Custom Dictionary Entries', stat: 0 },
      { name: 'Dictionary Entries', stat: 0 },
      { name: 'Searches in Past 24h', stat: 0 },
    ])

    onMounted(async () => {
        awaitingQuery.value = true

        console.log("== Fetching stats...")
        await fetch("/stats").then(rawResult => {
            console.dir(rawResult)
            rawResult.json().then((parsedResult) => {
                console.dir(parsedResult)
                // Check for errors
                if (parsedResult["success"] != true) {
                    console.log("err")
                    queryError.value = parsedResult["error"]
                    return
                }

                queryResults.value = parsedResult["result"]
                stats.value[0].stat = parsedResult["result"]["htdSize"]
                stats.value[1].stat = parsedResult["result"]["dictSize"]
                stats.value[2].stat = parsedResult["result"]["recentSearch"]
                console.dir(stats)
                ////console.dir(queryResults)
                //awaitingQuery.value = false
            }).catch((err) => {
                console.log("JSON ERR")
                console.log(err)
            })
        }).catch((err) => {
            console.log("Fetch ERR")
            console.log(err)
        })
        console.log("== Fetched.")
    });

    return { stats, awaitingQuery, queryError, queryResults };
  },
};
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-16">
    <h3 class="text-xl font-semibold leading-6 text-gray-900">Quick Stats</h3>
    <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div v-for="item in stats" :key="item.name" class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">{{ item.name }}</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{{ item.stat }}</dd>
      </div>
    </dl>
  </div>
</template>