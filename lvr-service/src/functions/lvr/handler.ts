import 'source-map-support/register'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import * as boom from '@hapi/boom'

import schema from './schema'

const lvr: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const {
    loanAmount,
    cashOutAmount,
    estimatedPropertyValue,
    physicalPropertyValue,
  } = event.body

  try {
    const borrowingAmount = loanAmount + (cashOutAmount || 0)
    if (!loanAmount) throw boom.badRequest('Loan amount is required')
    if (loanAmount <= 0) throw boom.badRequest('Loan amount must be above 0')

    const propertyValue = physicalPropertyValue || estimatedPropertyValue
    if (!propertyValue)
      throw boom.badRequest(
        'Either physical or estimated property value must be provided'
      )

    const lvr = ((borrowingAmount / propertyValue) * 100).toFixed(2) + '%'

    return formatJSONResponse(
      {
        lvr,
      },
      200
    )
  } catch (error) {
    if (boom.isBoom(error)) {
      return formatJSONResponse(
        {
          error: error.output.payload,
        },
        error.output.statusCode
      )
    }

    return formatJSONResponse(
      {
        message:
          "We don't know what happened, but the client can try better: )",
      },
      400
    )
  }
}

export const main = middyfy(lvr)
