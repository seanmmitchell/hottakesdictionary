interface Env {
    DICT : KVNamespace;
    HTD : KVNamespace;
}

async function getSize(kv) {
    console.log("Getting size...")
    var firstSize = (await kv.list()).keys.length
    if (firstSize < 1000) {
        console.log("First size accurate.")
        return firstSize
    }

    console.log("Sifting by each letter...")
    var totalSize = 0
    for (let i = 97; i <= 122; i++) {
        const letter = String.fromCharCode(i);
        totalSize += (await kv.list({prefix: letter})).keys.length
    }
    console.log("Returning total size.")
    return totalSize
}

export const onRequest : PagesFunction = async ({ request, next, env }) => {
    let url = new URL(request.url)
    
    var htdList = await getSize(env.HTD)
    var dictList = await getSize(env.DICT)
    console.log("Returning response.")
    return new Response(JSON.stringify({ success: true, result: {"htdSize": htdList, "dictSize": dictList, "recentSearch": 100}}), { headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
};