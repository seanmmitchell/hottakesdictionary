import util from './zutil'

interface Env {
    DICT : KVNamespace;
    HTD : KVNamespace;
}

export const onRequest : PagesFunction = async ({ request, next, env }) => {
    // Get Word
    var word = util.GetQueryWord(request)
    if (typeof word !== "string") {
        return word
    }

    // Check HTD
    util.Log(request, "Querying for word \"" + word + "\" in KV HTD...")
    let htdCheckStart = Date.now()
    let result = await env.HTD.get(word).then((value) => {
        let htdCheckFinish = Date.now()
        util.Log(request, "KV Query for \"" + word + "\" in HTD fetched in " + (htdCheckFinish - htdCheckStart) + "ms")

        if (value != null) {
            util.Log(request, "KV result in HTD is valid, returning...")
            return new Response(JSON.stringify({ success: true, result: value}), { headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
        } else {
            util.Log(request, "No KV entry in HTD found. Continuing...")
        }
    }).catch(() => {
        util.Log(request, "KV Query for \"" + word + "\" in HTD completely failed.", "error")
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
    util.Log(request, "Querying for word \"" + word + "\" in KV DICT...")
    let dictCheckStart = Date.now()
    result = await env.DICT.get(word, {type: "json"}).then((value) => {
        let dictCheckFinish = Date.now()
        util.Log(request, "KV Query for \"" + word + "\" in DICT fetched in " + (dictCheckFinish - dictCheckStart) + "ms")

        if (value != null) {
            util.Log(request, "KV result in DICT is valid, returning...")
            return new Response(JSON.stringify({ success: true, result: value}), { headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
        } else {
            util.Log(request, "No KV entry in DICT found. Continuing...")
        }
    }).catch(() => {
        util.Log(request, "KV Query for \"" + word + "\" in DICT completely failed.", "error")
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
    util.Log(request, "Querying word \"" + word + "\" in Dictionary API...")
    let dictionaryRequest = fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
    let queryStart = Date.now()
    return dictionaryRequest.then((dictionaryResult) => {
        let queryFinish = Date.now()
        util.Log(request, "Query for \"" + word + "\" in Dictionary API fetched in " + (queryFinish-queryStart) + "ms")

        return dictionaryResult.json().then((val) => {

            if (val["title"] == "No Definitions Found") {
                util.Log(request, "No entry in Dictionary API.")
                return new Response(
                    JSON.stringify({success: false, error: "Word not found."}), 
                    {
                        status: 200
                    }
                )
            } else {
                util.Log(request, "Entry in Dictionary API found.")
                let record = {
                    source: {
                        license: val[0]["license"],
                        sourceURLs: val[0]["sourceUrls"]
                    },
                    meanings: val[0]["meanings"]
                }

                util.Log(request, "Storing word \"" + word + "\" in KV DICT for future requests...")
                env.DICT.put(word, JSON.stringify(record), { metadata: { dictType: 1, fetchSource: "dictionaryapi.dev/api/v2/", fetchDate: Date.now()} }).then(() => {
                    util.Log(request, "Word \"" + word + "\" put in KV DICT.")
                }).catch((err) => {
                    util.Log(request, "Word \"" + word + "\" couldn't be put in KV DICT.")
                })

                util.Log(request, "Returning new word response.")
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
            "Final source, dictionary API, failed to return a result. Total failure.", 
            {
                status: 500
            }
        )
    })
};
