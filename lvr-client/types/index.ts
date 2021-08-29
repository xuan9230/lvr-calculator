export type LvrRequestBody = {
  loanAmount: number
  cashOutAmount?: number
  estimatedPropertyValue: number
  physicalPropertyValue?: number
  physicalEvidence?: string
}

export type LvrFormBody = {
  [P in keyof LvrRequestBody]?: string
}
