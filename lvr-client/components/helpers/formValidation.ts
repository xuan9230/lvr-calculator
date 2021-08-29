import * as yup from 'yup'
import { LvrFormBody } from '../../types'

const formValidationSchema: {
  [key in keyof LvrFormBody]: any
} = {
  estimatedPropertyValue: yup
    .number()
    .required('Required')
    .typeError('Must be a number')
    .min(100000, 'Min value 100000')
    .max(2500000, 'Max value 2500000'),
  loanAmount: yup
    .number()
    .required('Required')
    .typeError('Must be a number')
    .min(80000, 'Min value 80000')
    .max(2000000, 'Max value 2000000'),
}

/**
 * Dynamic validations to the form, see comments below
 */
export const getValidationSchema = ({
  estimatedPropertyValue,
  physicalPropertyValue,
  cashOutAmount,
}: LvrFormBody) => {
  const propertyValue = physicalPropertyValue || estimatedPropertyValue
  const numPtyValue = propertyValue ? +propertyValue : null

  const validationRules = { ...formValidationSchema }

  if (physicalPropertyValue) {
    validationRules.physicalPropertyValue = yup
      .number()
      .typeError('Must be a number')
    validationRules.physicalEvidence = yup
      .string()
      .required('Upload the evidence for physical property value.')
  }

  if (cashOutAmount) {
    if (typeof numPtyValue === 'number') {
      // Add cash out amount validation when property value is provided
      const max = 0.5 * numPtyValue
      validationRules.cashOutAmount = yup
        .number()
        .typeError('Must be a number')
        .min(0, 'Min value 0')
        .max(max, `Max value ${max}`)
    } else {
      // Otherwise - basic number validation
      validationRules.cashOutAmount = yup
        .number()
        .typeError('Must be a number')
        .min(0, 'Min value 0')
    }
  }

  return yup.object().shape(validationRules)
}
