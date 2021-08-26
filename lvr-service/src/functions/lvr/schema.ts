export default {
  type: 'object',
  properties: {
    loanAmount: { type: 'number' },
    cashOutAmount: { type: 'number' },
    estimatedPropertyValue: { type: 'number' },
    physicalPropertyValue: { type: 'number' },
  },
  required: ['loanAmount', 'estimatedPropertyValue'],
} as const
