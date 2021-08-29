export type LvrRequestBody = {
  loanAmount: number
  cashOutAmount?: number
  estimatedPropertyValue: number
  physicalPropertyValue?: number
}

export type LvrFormBody = {
  [P in keyof LvrRequestBody]?: string
}
