import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

function CurrencyInput({
  name,
  label,
  required = false,
  errors,
  multiline = false,
  type = 'text',
  ...others
}: {
  name: string
  label: string
  required?: boolean
  multiline?: boolean
  errors?: any
  type?: string
}) {
  const { control } = useFormContext()

  let isError = false
  let errorMessage = ''
  if (errors && errors.hasOwnProperty(name)) {
    isError = true
    errorMessage = errors[name].message
  }

  const style: any = {
    marginTop: 16,
  }

  if (!isError) style.marginBottom = 22

  return (
    <Controller
      {...others}
      as={TextField}
      name={name}
      control={control}
      defaultValue=""
      label={label}
      fullWidth={true}
      style={style}
      variant="outlined"
      type={type}
      multiline={multiline}
      InputLabelProps={{
        className: required ? 'required-label' : '',
        required: required || false,
      }}
      error={isError}
      helperText={errorMessage}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
    />
  )
}

export default CurrencyInput
