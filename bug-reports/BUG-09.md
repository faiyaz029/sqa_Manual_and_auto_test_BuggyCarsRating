# Login Rejects Whitespace-Padded Usernames

## Steps
1. Sign in with the configured valid account to confirm the account is usable.
2. Sign out.
3. Enter the same username with leading and trailing spaces and submit the unchanged password.

## Expected
Leading and trailing username spaces are trimmed or normalized, and the valid account can sign in.

## Actual
The padded username is rejected with an invalid username/password response, although the unpadded account signs in successfully.

## Browser
Chromium, verified by Playwright.

## Screenshot
Not captured: browser screenshot tools timed out waiting for page fonts. The test uses the environment-provided account and clears both fields after submit to avoid retaining credentials in failure output.