# Gnosis Safe Deployment API

This API provides an endpoint to deploy a Gnosis Safe contract on the Ethereum blockchain.

## Endpoint

### POST /safe/deploy

Deploys a new Gnosis Safe contract.

#### Request Body

- `owners`: An array of Ethereum addresses that will be the owners of the Safe. At least one owner is required.
- `threshold`: The number of owners that need to confirm a transaction before it can be executed. If not provided, a default value of 1 is used.

#### Response

If the Safe is deployed successfully, the API will return a JSON object with a `message` field and a `data` field. The `data` field is an object that contains the `address` of the deployed Safe.

Example:

```json
{
  "message": "Safe deployed successfully",
  "data": {
    "address": "0x..."
  }
}
```

#### Errors

If an error occurs during the deployment of the Safe, the API will return a JSON object with a `message` field that describes the error.

Example:

```json
{
  "message": "Error deploying Safe: ..."
}
```

## Error Handling

If no owners are provided in the request body, the API will return a 400 Bad Request error with a message indicating that at least one owner address is required.

If an error occurs during the deployment of the Safe, the API will return a 500 Internal Server Error with a message describing the error.