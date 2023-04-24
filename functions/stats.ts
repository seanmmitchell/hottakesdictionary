interface Env {
    DICT : KVNamespace;
    HTD : KVNamespace;
}

export const onRequest : PagesFunction = async ({ request, next, env }) => {
    let url = new URL(request.url)
    
    var htdList = (await env.HTD.list()).keys.length
    var dictList = (await env.DICT.list()).keys.length
    console.log("Returning response.")
    return new Response(JSON.stringify({ success: true, result: {"htdSize": htdList, "dictSize": dictList, "recentSearch": 100}}), { headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
};