<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router'

export default {
  setup() {
    const word = ref('');
    const awaitingQuery = ref(true);
    const queryError = ref('');
    const queryResults = ref({});

    onMounted(async () => {
        awaitingQuery.value = true

        const route = useRoute();

        word.value = route.query["word"]
        console.log("== Fetching \"" + word.value + "\"...")
        await fetch("/query?word=" + word.value).then(rawResult => {
            console.dir(rawResult)
            rawResult.json().then((parsedResult) => {
                consile.dir(parsedResult)
                // Check for errors
                if (parsedResult["success"] != true) {
                    console.log("err")
                    queryError.value = parsedResult["error"]
                    return
                }

                var tmp = parsedResult["result"]
                tmp = tmp["meanings"]
                tmp = tmp[0]
                tmp = tmp["definitions"]
                queryResults.value = tmp
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


    return { word, awaitingQuery, queryError, queryResults };
  },
};
</script>

<template>
    <div class="w-8/12 mx-auto mt-10 p-8 rounded-lg border border-gray-300">
        <div v-if="awaitingQuery">
            <div v-if="!queryError != ''">
                <div v-for="definition in queryResults">
                    <div class="mt-4 p-4 rounded-xl bg-gray-100">
                        <p class="text-4xl">{{ word }}</p>
                        <p class="text-2xl">{{ definition["definition"] }}</p>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="rounded-md bg-red-50 p-4">
                    <div class="flex">
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">An Error Occurred:</h3>
                        <div class="mt-2 text-sm text-red-700">
                        <ul role="list" class="list-disc space-y-1 pl-5">
                            <li>{{queryError}}</li>
                        </ul>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div class="mx-auto mt-4 flex flex-col items-center">
                <router-link :to="{name: 'home'}">
                    <button type="button" class="rounded-full border border-transparent bg-[#176087] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#62B7E4] focus:outline-none focus:ring-2 focus:ring-[#62B7E4] focus:ring-offset-2">
                        Return to Search
                    </button>
                </router-link>
            </div>
        </div>
        <div v-else>

        </div>
    </div>
</template>