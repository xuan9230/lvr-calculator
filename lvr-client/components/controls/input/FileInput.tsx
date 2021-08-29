import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import { useFormContext, Controller } from 'react-hook-form'

function ButtonFileInput({
  name,
  label,
  accept,
  errorMessage,
  ...others
}: {
  name: string
  label: string
  accept: string
  errorMessage?: string
}) {
  return (
    <>
      <Button variant="outlined" component="label">
        {label}
        <input
          {...others}
          accept={accept}
          name={name}
          type="file"
          id="asdasd"
          hidden
        />
      </Button>
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </>
  )
}

function FileInput({
  name,
  label,
  accept,
  errors,
  ...others
}: {
  name: string
  label: string
  accept: string
  errors?: any
}) {
  const { control } = useFormContext()
  let errorMessage = ''
  if (errors && errors.hasOwnProperty(name)) {
    errorMessage = errors[name].message
  }

  return (
    <Controller
      {...others}
      accept={accept}
      defaultValue=""
      as={ButtonFileInput}
      name={name}
      control={control}
      label={label}
      errorMessage={errorMessage}
    />
  )
}

export default FileInput
