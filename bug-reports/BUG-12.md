# Login Rejects Uppercase Usernames

## Steps
1. Sign in with the configured valid account to confirm the account is usable.
2. Sign out.
3. Submit the same username in uppercase with the unchanged password.

## Expected
The username is accepted or normalized regardless of case.

## Actual
The uppercase username is rejected with an invalid username/password response, while the original username succeeds.

## Browser
Chromium, verified by Playwright.

## Screenshot
Not captured: browser screenshot tools timed out while waiting for page fonts. The test clears the submitted fields to keep credentials out of failure output.