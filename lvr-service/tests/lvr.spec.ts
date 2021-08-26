import { calculateLVR } from '../src/functions/lvr/handler'
import { LvrRequestBody } from '@functions/lvr/types'

test('Calculates LVR simply with loan amount and estimated property value', () => {
  const sampleBody: LvrRequestBody = {
    loanAmount: 50000,
    estimatedPropertyValue: 100000,
  }

  const result = calculateLVR(sampleBody)

  expect(result).toBe('50.0%')
})

test('Calculates LVR with cash out amount', () => {
  const sampleBody: LvrRequestBody = {
    loanAmount: 50000,
    cashOutAmount: 10000,
    estimatedPropertyValue: 100000,
  }

  const result = calculateLVR(sampleBody)

  expect(result).toBe('60.0%')
})

test('Calculates LVR with physical property value as precedence', () => {
  const sampleBody: LvrRequestBody = {
    loanAmount: 50000,
    estimatedPropertyValue: 100000,
    physicalPropertyValue: 150000,
  }

  const result = calculateLVR(sampleBody)

  expect(result).toBe('33.3%')
})

test('Throws error when loan amount is not provided', () => {
  const sampleBody: any = {
    estimatedPropertyValue: 100000,
  }

  try {
    calculateLVR(sampleBody)
  } catch (err) {
    expect(err.output.payload.message).toBe('Loan amount is required')
  }
})

test('Throws error when loan amount is negative', () => {
  const sampleBody: LvrRequestBody = {
    loanAmount: -50000,
    estimatedPropertyValue: 100000,
  }

  try {
    calculateLVR(sampleBody)
  } catch (err) {
    expect(err.output.payload.message).toBe('Loan amount must be above 0')
  }
})

test('Throws error when neither property value is provided', () => {
  const sampleBody: any = {
    loanAmount: 50000,
  }

  try {
    calculateLVR(sampleBody)
  } catch (err) {
    expect(err.output.payload.message).toBe(
      'Either physical or estimated property value must be provided'
    )
  }
})

test('Throws error when loan amount is negative', () => {
  const sampleBody: LvrRequestBody = {
    loanAmount: 50000,
    cashOutAmount: 60000,
    estimatedPropertyValue: 100000,
  }

  try {
    calculateLVR(sampleBody)
  } catch (err) {
    expect(err.output.payload.message).toBe(
      'Cash out amount cannot be more than 50% of property value'
    )
  }
})
