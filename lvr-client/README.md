# LVR Client

Renders the form to fill in LVR related values and call the calculation service/submission service.

Values include loan amount, cash out amount, estimated property value and physical property value.

Using the `lvr-service` to calculate LVR deployed on AWS lambda. Both service urls are configurable in `.env`.

## Assumptions

1. Validations are done by both front-end and back-end. Try and see how they work!

2. User needs to calculate LVR first and get it <90% before they can submit the form.

3. Physical evidence will be pdf files the user can upload. Files should not be posted directly into a db/endpoint in real world scenario, so I left it half-implemented. A good design would be upload to S3.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
