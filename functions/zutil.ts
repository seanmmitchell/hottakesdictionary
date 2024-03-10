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

function GetQueryWord(request: any) {
    // Get Query Param
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
    
    return word
}

export default {
    GenerateLogTimestamp,
    Log,
    GetQueryWord
}