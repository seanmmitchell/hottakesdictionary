import { Ai } from "@cloudflare/ai";
import util from "./zutil";

export const onRequest : PagesFunction = async ({ request, next, env }) => {
    // Get Word
    var word = util.GetQueryWord(request)
    if (typeof word !== "string") {
        return word
    }

    util.Log(request, "Querying word \"" + word + "\" from our API...")
    let dictionaryRequest = fetch("https://hottakesdictionary.com/query?word=" + word)
    let queryStart = Date.now()
    dictionaryRequest.then((parsedResult) => {
        let queryFinish = Date.now()
        util.Log(request, "Query for \"" + word + "\" in HTD API fetched in " + (queryFinish-queryStart) + "ms")

        return parsedResult.json().then((val) => {
            // Check for errors
            if (parsedResult["success"] != true) {
                return new Response(
                    "Final source, dictionary API failed to return a **valid** result. Total failure.", 
                    {
                        status: 500
                    }
                )
            }

            var tmp = parsedResult["result"]
            tmp = tmp["meanings"]
            tmp = tmp[0]
            tmp = tmp["definitions"]

            console.dir(tmp)

            const ai = new Ai(env.AI);

            const inputs = {
              prompt: tmp
            };
            
            const response = ai.run(
              '@cf/stabilityai/stable-diffusion-xl-base-1.0',
              inputs
            );
            
            return new Response(response, {
              headers: {
                'content-type': 'image/png'
              }
            });        
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