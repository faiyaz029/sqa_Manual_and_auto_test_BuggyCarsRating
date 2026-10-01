# Logout From Overall Rating Does Not Clear the Session

## Steps
1. Sign in with the configured valid account.
2. Open the Overall Rating page.
3. Click Logout.

## Expected
The user is logged out and the Logout link is removed.

## Actual
The Logout link remains visible after clicking it on the Overall Rating page.

## Browser
Chromium, verified by Playwright.

## Screenshot
Not captured: browser screenshot tools timed out while waiting for page fonts. The state assertion is in TC-027.