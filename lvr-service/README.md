# LVR Calculation Service

Calculates LVR based on `loanAmount`, `cashOutAmount`, `estimatedPropertyValue` and `physicalPropertyValue`.

Serverless - AWS Lambda Node.js Typescript

Has been deployed to Lambda, access it directly via api gateway `https://ykyvsp9shi.execute-api.us-east-1.amazonaws.com/dev/lvr` or locally, see below instructions.

## Assumptions

1. Loan Amount and Estimated Property Value are required in the request body.

## Stretches/Future Work

1. Deployment: handled by serverless framework. Infrastructure is configured as code in `serverless.ts`. Already deployed to `dev`, multi environments can be added in the future.

2. Authorisation: requires users to be approved before they can access the API. Based on the current serverless architecure, a good choice is to use `Lambda Authorizer` - when a client makes a request to the API, the reqeust contains the user's identity in a form e.g. Json Web Token (JWT), then API Gateway calls the Lambda authorizer, which takes the caller's identity as input and returns an IAM policy as output.

3. Sanitization: for simplicity, client always sends numeric value, and the service is not doing a complete type checking/validations. This can easily be added into the handler.

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

## Unit Tests

Run `yarn test`

## Test your service

This template contains a single lambda function triggered by an HTTP request made on the provisioned API Gateway REST API `/lvr` route with `POST` method. The request body must be provided as `application/json`. The body structure is tested by API Gateway against `src/functions/lvr/schema.ts` JSON-Schema definition: it must contain the `loanAmount` and `estimatedPropertyValue` property.

- requesting any other path than `/lvr` with any other method than `POST` will result in API Gateway returning a `403` HTTP error code
- sending a `POST` request to `/lvr` with a payload **not** containing required properties will result in API Gateway returning a `400` HTTP error code
- sending a `POST` request to `/lvr` with a payload containing required properties will result in API Gateway returning a `200` HTTP status code with a message saluting the provided name and the detailed event processed by the lambda

> :warning: As is, this template, once deployed, opens a **public** endpoint within your AWS account resources. Anybody with the URL can actively execute the API Gateway endpoint and the corresponding lambda. You should protect this endpoint with the authentication method of your choice.

### Locally

In order to test the lvr function locally, run the following command:

- `npx sls invoke local -f lvr --path src/functions/lvr/mock.json` if you're using NPM
- `yarn sls invoke local -f lvr --path src/functions/lvr/mock.json` if you're using Yarn

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl --location --request POST 'https://myApiEndpoint/dev/lvr' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```

## Template features

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
????????? src
???   ????????? functions               # Lambda configuration and source code folder
???   ???   ????????? lvr
???   ???   ???   ????????? handler.ts      # `Lvr` lambda source code
???   ???   ???   ????????? index.ts        # `Lvr` lambda Serverless configuration
???   ???   ???   ????????? mock.json       # `Lvr` lambda input parameter, if any, for local invocation
???   ???   ???   ????????? schema.ts       # `Lvr` lambda input event JSON-Schema
???   ???   ???
???   ???   ????????? index.ts            # Import/export of all lambda configurations
???   ???
???   ????????? libs                    # Lambda shared code
???       ????????? apiGateway.ts       # API Gateway specific helpers
???       ????????? handlerResolver.ts  # Sharable library for resolving lambda handlers
???       ????????? lambda.ts           # Lambda middleware
???
????????? package.json
????????? serverless.ts               # Serverless service file
????????? tsconfig.json               # Typescript compiler configuration
????????? tsconfig.paths.json         # Typescript paths
????????? webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`
