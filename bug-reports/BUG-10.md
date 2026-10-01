# Login Does Not Create a Session Cookie

## Steps
1. Sign in with the configured valid account.
2. Inspect cookies for `buggy.justtestit.org`.
3. Sign out and inspect the cookies again.

## Expected
A session cookie is created after login and deleted on logout.

## Actual
The user is authenticated, but Playwright finds no cookies for the site. Logout therefore has no session cookie to delete.

## Browser
Chromium, verified by Playwright.

## Screenshot
Not captured: browser screenshot tools timed out while waiting for page fonts. The cookie counts are asserted in TC-021 and TC-025.