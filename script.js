const apiKey = '';

function fetchLatestQuote (ticker) {
    fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`)
    .then(response => response.json())
    .then(tickerData =>
        console.log(tickerData)
    )
    .catch(error => console.log('The server has returned with error: ' + error))
}
