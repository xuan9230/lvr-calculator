import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'

import styles from './LvrForm.module.scss'
import { getValidationSchema } from './helpers/formValidation'
import FormInput from '../components/controls/input'
import { LvrFormBody } from '../types'

function LvrForm() {
  const [calculating, setCalculating] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  /** Validations */
  const validationSchema = yup.lazy(getValidationSchema)

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(validationSchema),
  })

  const { handleSubmit, errors, watch } = methods

  /**
   * Submit form values to calculate LVR
   */
  const onCalculate = async (values: LvrFormBody) => {
    setCalculating(true)

    try {
      const res = await axios.post(
        'https://ykyvsp9shi.execute-api.us-east-1.amazonaws.com/dev/lvr',
        values
      )
      console.log(res)
    } catch (err) {
      throw err
    } finally {
      setCalculating(false)
    }
  }

  /**
   * Submit form inputs to a configurable URL
   */
  const onSubmit = async (values: { [key: string]: string }) => {
    setSubmitting(true)

    const sanitizedValues: any = {}
    Object.entries(values).forEach(
      ([key, value]: [key: string, value: any]) => {
        if (value) {
          //   if (key === 'phone_number') {
          //     const trimmed = value.replace(/ /g, '')
          //     if (trimmed.startsWith('+')) sanitizedValues[key] = `${trimmed}`
          //     else sanitizedValues[key] = `+61${trimmed.substr(1, 10)}`
          //   } else sanitizedValues[key] = `${value}`
        }
      }
    )

    const { email, password, ...attributes } = sanitizedValues

    try {
      //   await Auth.signUp({
      //     username: email,
      //     password,
      //     attributes,
      //   })
      //   history.push('/signup-success')
    } catch (err) {
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const hasPhysicalValue = watch('physicalPropertyValue')

  return (
    <div id={styles['form-container']}>
      <FormProvider {...methods}>
        <form>
          <FormInput
            name="estimatedPropertyValue"
            label="Estimated Property Value"
            required={true}
            errors={errors}
            type="number"
          />

          <FormInput
            name="loanAmount"
            label="Estimated Loan Value"
            required={true}
            errors={errors}
            type="number"
          />

          <FormInput
            name="cashOutAmount"
            label="Cash Out Amount"
            errors={errors}
            type="number"
          />

          <FormInput
            name="physicalPropertyValue"
            label="Physical Property Value"
            errors={errors}
            type="number"
          />

          {hasPhysicalValue && <div>evidence!!</div>}
        </form>
      </FormProvider>
      <div style={{ marginTop: 32 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSubmit(onCalculate)}
          disabled={calculating}
        >
          {submitting ? <CircularProgress /> : 'Calculate'}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={submitting}
        >
          {submitting ? <CircularProgress /> : 'Submit'}
        </Button>
      </div>
    </div>
  )
}

export default LvrForm
