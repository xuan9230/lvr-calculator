import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'

import styles from './LvrForm.module.scss'
import { getValidationSchema } from './helpers/formValidation'
import CurrencyInput from './controls/input/CurrencyInput'
import { LvrFormBody } from '../types'
import FileInput from './controls/input/FileInput'

function LvrForm() {
  const [lvrValue, setLvrValue] = useState<number | null>(null)
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
    if (!process.env.NEXT_PUBLIC_CALCULATION_SERVICE_URL) return null
    setCalculating(true)

    const sanitizedRequestBody: any = {}
    Object.entries(values).forEach(([key, value]) => {
      if (value) sanitizedRequestBody[key] = +value
    })

    try {
      const { data } = await axios.post(
        process.env.NEXT_PUBLIC_CALCULATION_SERVICE_URL,
        sanitizedRequestBody
      )

      const _lvrValue = parseFloat(data?.lvr)
      if (!isNaN(_lvrValue)) setLvrValue(_lvrValue)
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
    if (!process.env.NEXT_PUBLIC_SUBMISSION_URL) {
      console.warn('Please provide the url to submit data to.')
      return null
    }
    setSubmitting(true)

    const sanitizedRequestBody: any = {}
    Object.entries(values).forEach(([key, value]) => {
      if (value) sanitizedRequestBody[key] = +value
    })

    try {
      await axios.post(
        process.env.NEXT_PUBLIC_SUBMISSION_URL,
        sanitizedRequestBody
      )
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
          <CurrencyInput
            name="estimatedPropertyValue"
            label="Estimated Property Value"
            required={true}
            errors={errors}
          />

          <CurrencyInput
            name="loanAmount"
            label="Estimated Loan Value"
            required={true}
            errors={errors}
          />

          <CurrencyInput
            name="cashOutAmount"
            label="Cash Out Amount"
            errors={errors}
          />

          <CurrencyInput
            name="physicalPropertyValue"
            label="Physical Property Value"
            errors={errors}
          />

          {hasPhysicalValue && (
            <FileInput
              name="physicalEvidence"
              label="Upload Evidence"
              accept="application/pdf"
              errors={errors}
            />
          )}
        </form>
      </FormProvider>
      <div id={styles['lvr-result']}>
        {lvrValue && (
          <p style={{ margin: 0 }}>
            Your LVR: {lvrValue}% {lvrValue >= 90 && 'is beyond the limit.'}
          </p>
        )}
      </div>
      <div id={styles['buttons-container']}>
        {calculating ? (
          <CircularProgress />
        ) : (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSubmit(onCalculate)}
            disabled={calculating}
          >
            Calculate
          </Button>
        )}

        {submitting ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={!lvrValue || lvrValue >= 90 || calculating || submitting}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  )
}

export default LvrForm
