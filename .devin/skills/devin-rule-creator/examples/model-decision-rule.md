---
trigger: model_decision
description: "Guidelines for designing and reviewing REST API endpoints"
---

# API Design

## Response Format

- Always return JSON with a consistent envelope:
  ```json
  { "success": true, "data": {} }
  ```
- Use HTTP status codes correctly:
  - 200 OK
  - 201 Created
  - 400 Bad Request
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found
  - 500 Internal Server Error

## Validation

- Validate request bodies before processing.
- Return 400 with a clear, field-level error message.

## Security

- Authenticate every mutating endpoint.
- Never trust user input; sanitize and escape where needed.
