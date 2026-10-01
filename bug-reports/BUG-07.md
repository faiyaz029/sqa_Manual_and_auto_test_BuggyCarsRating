# Navbar Password Field Has No Accessible Name

## Steps
1. Open the home page.
2. Inspect the Login and Password inputs in the navbar.

## Expected
Both inputs have an associated label, accessible name, or placeholder.

## Actual
The password input has no label, `aria-label`, or placeholder. It appears as an unnamed textbox in the accessibility snapshot.

## Browser
Chromium, observed through Playwright MCP.

## Screenshot
Not captured: the browser screenshot tools timed out while waiting for page fonts. Supporting accessibility snapshot: `.playwright-mcp/page-2026-10-01T11-02-07-902Z.yml`.