# Register Button Has No Hover Visual State

## Steps
1. Open the Register page.
2. Complete the five labeled fields with matching passwords.
3. Hover the enabled Register button.

## Expected
The visible Register button provides hover and active visual states.

## Actual
The enabled button's computed background, text, border, and shadow styles are unchanged on hover.

## Browser
Chromium, verified in Playwright.

## Screenshot
Not captured: both browser screenshot backends timed out while waiting for page fonts. Playwright failure context is under `test-results/register-Register-form-UI--30ba0-has-hover-and-active-states-chromium/`.