interface Env {
    DICT : KVNamespace;
    HTD : KVNamespace;
}

function GenerateLogTimestamp() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0');
    return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function Log(request, message, type="log") {
    // Get Timestamp
    const timestamp = GenerateLogTimestamp()

    // Get CF Data
    const { cf } = request;
    const { country, colo,  } = cf;
    var rayID = request.headers.get("CF-Ray")
    if (rayID == null) {
        rayID = "NO-RAY"
    }

    // Send to Console
    const finalMessage = `${timestamp} | ${country}-${colo} ${rayID} > ${message}`
    switch (type.toLowerCase()) {
        case "error":
            console.error(finalMessage)
        case "warn":
            console.warn(finalMessage)
        case "info":
            console.info(finalMessage)
        case "debug":
            console.debug(finalMessage)
        case "log":
            console.log(finalMessage)
        default:
            console.log(finalMessage)
    }
}

export default {
    GenerateLogTimestamp,
    Log
}

export const onRequest : PagesFunction = async ({ request, next, env }) => {
    let url = new URL(request.url)
    let wordQuery = url.searchParams.get("word")
    Log(request, "Test New Query with word \"" + wordQuery + "\"")

    // Reject bad Input
    if (wordQuery == undefined) {
        return new Response(
            "Invalid query...", 
            {
                status: 500
            }
        )
    }

    // Normalize Input
    let word = wordQuery.toLowerCase()
    Log(request, "Word \"" + wordQuery + "\" normalized to: " + word)

    // Check HTD
    Log(request, "Querying for word \"" + word + "\" in KV HTD...")
    let htdCheckStart = Date.now()
    let result = await env.HTD.get(word).then((value) => {
        let htdCheckFinish = Date.now()
        Log(request, "KV Query for \"" + word + "\" in HTD fetched in " + (htdCheckFinish - htdCheckStart) + "ms")

        if (value != null) {
            Log(request, "KV result in HTD is valid, returning...")
            return new Response(JSON.stringify({ success: true, result: value}), { headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
        } else {
            Log(request, "No KV entry in HTD found. Continuing...")
        }
    }).catch(() => {
        Log(request, "KV Query for \"" + word + "\" in HTD completely failed.", "error")
        /*return new Response(
            "An error occured fetching from KV stores.", 
            {
                status: 500
            }
        )*/
    })
    if (result != null) {
        return result
    }

    // Check Dictionary
    Log(request, "Querying for word \"" + word + "\" in KV DICT...")
    let dictCheckStart = Date.now()
    result = await env.DICT.get(word, {type: "json"}).then((value) => {
        let dictCheckFinish = Date.now()
        Log(request, "KV Query for \"" + word + "\" in DICT fetched in " + (dictCheckFinish - dictCheckStart) + "ms")

        if (value != null) {
            Log(request, "KV result in DICT is valid, returning...")
            return new Response(JSON.stringify({ success: true, result: value}), { headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
        } else {
            Log(request, "No KV entry in DICT found. Continuing...")
        }
    }).catch(() => {
        Log(request, "KV Query for \"" + word + "\" in DICT completely failed.", "error")
        /*return new Response(
            "An error occured fetching from KV stores.", 
            {
                status: 500
            }
        )*/
    })
    if (result != null) {
        return result
    }

    // Fetch from Dictionary API
    Log(request, "Querying word \"" + word + "\" in Dictionary API...")
    let dictionaryRequest = fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
    let queryStart = Date.now()
    return dictionaryRequest.then((dictionaryResult) => {
        let queryFinish = Date.now()
        Log(request, "Query for \"" + word + "\" in Dictionary API fetched in " + (queryFinish-queryStart) + "ms")

        return dictionaryResult.json().then((val) => {

            if (val["title"] == "No Definitions Found") {
                Log(request, "No entry in Dictionary API.")
                return new Response(
                    JSON.stringify({success: false, error: "Word not found."}), 
                    {
                        status: 200
                    }
                )
            } else {
                Log(request, "Entry in Dictionary API found.")
                let record = {
                    source: {
                        license: val[0]["license"],
                        sourceURLs: val[0]["sourceUrls"]
                    },
                    meanings: val[0]["meanings"]
                }

                Log(request, "Storing word \"" + word + "\" in KV DICT for future requests...")
                env.DICT.put(word, JSON.stringify(record), { metadata: { dictType: 1, fetchSource: "dictionaryapi.dev/api/v2/", fetchDate: Date.now()} }).then(() => {
                    Log(request, "Word \"" + word + "\" put in KV DICT.")
                }).catch((err) => {
                    Log(request, "Word \"" + word + "\" couldn't be put in KV DICT.")
                })

                Log(request, "Returning new word response.")
                return new Response(JSON.stringify({ success: true, result: record}), { headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
                //return new Response(JSON.stringify(record))
            }
        }).catch(() => {
            return new Response(
                "Final source, dictionary API failed to return a **valid** result. Total failure.", 
                {
                    status: 500
                }
            )
        })
    }).catch(() => {
        return new Response(
            "Final source, dictionary API failed to return a result. Total failure.", 
            {
                status: 500
            }
        )
    })
};
