# Malformed Login Email Has No Field Validation

## Steps
1. Open the home page.
2. Enter `testgmail.com`, `test@`, `@gmail.com`, or `test!@gmail.com` in the Login field.
3. Inspect the Login field's native validity state.

## Expected
The Login field rejects malformed email values and presents a field-level validation message.

## Actual
The field is a text input without an email constraint. `checkValidity()` returns true for malformed values, and no field-level error is exposed.

## Browser
Chromium, observed through Playwright MCP.

## Screenshot
Not captured: the browser screenshot tools timed out while waiting for page fonts. Supporting accessibility snapshot: `.playwright-mcp/page-2026-10-01T11-02-07-902Z.yml`.