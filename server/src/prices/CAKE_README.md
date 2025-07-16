GET /v2/rates

Retrieve historical price points for a given base/quote pair at specified intervals.

⸻

Endpoint

GET https://fiat-api.cakewallet.com/v2/rates

⸻

Authentication

This endpoint requires an API key. You can provide the key in one of two ways:
•Query Parameter: key (e.g. ?key=YOUR_API_KEY)
•Header: x-api-key: YOUR_API_KEY

If no valid API key is provided, the request will return 401 Unauthorized.

⸻

Query Parameters
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| key | string | yes | N/A | Your API key. |
| quote | string | no | USDT | The quote asset symbol (e.g. USD, USDT, BTC). Case-insensitive. |
| base | string | no | XMR | The base asset symbol (e.g. XMR, ETH, BTC). Case-insensitive. |
| interval_minutes | integer | no | 60 | Time between data points, in minutes. Must be a positive integer. |
| interval_count | integer | no | 1 | Number of data points to retrieve. Must be a positive integer. |
| date | string | no | Now - 60s | ISO 8601 timestamp string to align intervals around. If omitted, uses current time minus 60 seconds. |

Note: All symbol inputs are normalized to uppercase in the response.

⸻

Response
•Status: 200 OK
•Content-Type: application/json

JSON Schema

{
"timestamp": "string", // ISO 8601 timestamp aligned to the first interval
"quote": "string", // Uppercase quote symbol
"base": "string", // Uppercase base symbol
"interval_minutes": number, // Interval length in minutes
"interval_count": integer, // Number of intervals requested
"consumed_30d": integer|null, // amount of data consumed in last 30 days. this field will always be zero, and currently isn't functional.
"errors": { // Map of timestamp -> error message for failed intervals
"<ISO8601>": "<error message>"
},
"results": { // Map of timestamp -> price value for successful intervals
"<ISO8601>": <price as number>
}
}

FieldTypeDescription
timestampstring (ISO 8601)The reference timestamp aligned to the first returned interval.
quotestringQuote asset symbol.
basestringBase asset symbol.
interval_minutesnumberDuration of each interval in minutes.
interval_countintegerNumber of intervals returned.
consumed_30dinteger or null(Optional) Data consumption over the past 30 days.
errorsobjectKeyed by interval timestamp; contains error messages for failed price fetches.
resultsobjectKeyed by interval timestamp; contains fetched price values.

⸻

Examples

Request

curl "https://fiat-api.cakewallet.com/v2/rates?key=YOUR_API_KEY&quote=BTC&base=ETH&interval_minutes=15&interval_count=4&date=2025-06-30T12:00:00Z"

Sample Response (200)

{
"timestamp": "2025-06-30T12:00:00Z",
"quote": "BTC",
"base": "ETH",
"interval_minutes": 15,
"interval_count": 4,
"consumed_30d": 12345,
"errors": {},
"results": {
"2025-06-30T12:00:00Z": 0.0625,
"2025-06-30T11:45:00Z": 0.0627,
"2025-06-30T11:30:00Z": 0.0626,
"2025-06-30T11:15:00Z": 0.0628
}
}

⸻

Error Handling

Status CodeErrorDescription
400invalidIntervalinterval_minutes was not a valid integer.
400invalidCountinterval_count was not a valid integer.
400invalidDatedate was not a valid ISO 8601 string.
401unauthorizedMissing or invalid API key.
500server_errorAn unexpected error occurred.
