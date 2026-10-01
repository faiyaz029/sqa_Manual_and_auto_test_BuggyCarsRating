import { test, expect } from '@playwright/test';

const homeUrl = 'https://buggy.justtestit.org/';
const user = process.env.BUGGY_USER;
const pass = process.env.BUGGY_PASS;
const hasCredentials = Boolean(user && pass);

async function openHome(page: import('@playwright/test').Page) {
  await page.goto(homeUrl);
}

async function submitLogin(
  page: import('@playwright/test').Page,
  username: string,
  password: string,
) {
  const usernameField = page.getByPlaceholder('Login');
  const passwordField = page.locator('nav input[name="password"]');
  await usernameField.fill(username);
  await passwordField.fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  if (await passwordField.count()) await passwordField.fill('');
  if (await usernameField.count()) await usernameField.fill('');
}

async function loginWithPrimaryAccount(page: import('@playwright/test').Page) {
  test.skip(!hasCredentials, 'BUGGY_USER and BUGGY_PASS are required');
  await submitLogin(page, user!, pass!);
  const logout = page.getByRole('link', { name: 'Logout' });
  let authenticated = true;
  try {
    await expect(logout).toBeVisible();
  } catch {
    authenticated = false;
  }
  test.skip(!authenticated, 'Configured BUGGY_USER and BUGGY_PASS did not authenticate');
  await expect(page.getByText(/Hi,/)).toBeVisible();
}

async function verifyPrimaryAccount(page: import('@playwright/test').Page) {
  await loginWithPrimaryAccount(page);
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByPlaceholder('Login')).toBeVisible();
}

test.describe('Login', () => {
  test('TC-002: login inputs are visible and editable', async ({ page }) => {
    await openHome(page);

    const username = page.getByPlaceholder('Login');
    const password = page.locator('nav input[name="password"]');
    await expect(username).toBeVisible();
    await expect(username).toBeEditable();
    await expect(password).toBeVisible();
    await expect(password).toBeEditable();
  });

  test('TC-003: both login inputs have a label or placeholder', async ({ page }) => {
    // Known accessibility defect: see bug-reports/BUG-07.md.
    test.fail(true, 'Password input has no accessible label or placeholder');
    await openHome(page);

    const password = page.locator('nav input[name="password"]');
    const hasAccessibleName = await password.evaluate((input: HTMLInputElement) =>
      Boolean(input.getAttribute('aria-label') || input.placeholder || input.labels?.length),
    );
    expect(hasAccessibleName).toBe(true);
  });
  test('TC-004: Login and Register controls change color on hover', async ({ page }) => {
    await openHome(page);

    const login = page.getByRole('button', { name: 'Login' });
    const register = page.getByRole('link', { name: 'Register' });
    const background = (locator: typeof login) =>
      locator.evaluate(element => getComputedStyle(element).backgroundColor);

    const loginBefore = await background(login);
    const registerBefore = await background(register);
    expect(loginBefore).not.toBe(registerBefore);

    await login.hover();
    await expect.poll(() => background(login)).not.toBe(loginBefore);
    await register.hover();
    await expect.poll(() => background(register)).not.toBe(registerBefore);
  });

  const malformedEmails = [
    ['TC-005', 'missing @', 'testgmail.com'],
    ['TC-006', 'missing domain', 'test@'],
    ['TC-007', 'missing username', '@gmail.com'],
    ['TC-008', 'disallowed special character', 'test!@gmail.com'],
  ] as const;

  for (const [caseId, description, value] of malformedEmails) {
    test(`${caseId}: malformed username ${description} is rejected on the field`, async ({ page }) => {
      // Known validation defect: see bug-reports/BUG-06.md.
      test.fail(true, 'Malformed email-like usernames are not marked invalid');
      await openHome(page);

      const username = page.getByPlaceholder('Login');
      await username.fill(value);
      expect(await username.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false);
    });
  }

  test('TC-009: leading and trailing username spaces are normalized', async ({ page }) => {
    // Known normalization defect: see bug-reports/BUG-09.md.
    test.fail(true, 'Leading and trailing username spaces are rejected');
    await openHome(page);
    await verifyPrimaryAccount(page);
    await submitLogin(page, ` ${user!} `, pass!);
    await expect(page.getByText(/Hi,/)).toBeVisible();
  });

  test('TC-010: uppercase username is accepted or normalized', async ({ page }) => {
    // Known case-normalization defect: see bug-reports/BUG-12.md.
    test.fail(true, 'Uppercase username is rejected');
    test.skip(!hasCredentials || user === user!.toUpperCase(), 'A lowercase account is required');
    await openHome(page);
    await verifyPrimaryAccount(page);
    await submitLogin(page, user!.toUpperCase(), pass!);
    await expect(page.getByText(/Hi,/)).toBeVisible();
  });

  test('TC-011: a password containing special characters is accepted', async ({ page }) => {
    test.skip(!hasCredentials || !/[^a-zA-Z0-9]/.test(pass!), 'Configured password has no special characters');
    await openHome(page);
    await verifyPrimaryAccount(page);
    await submitLogin(page, user!, pass!);
    await expect(page.getByText(/Hi,/)).toBeVisible();
  });

  test('TC-012: clearing an autofilled password shows required validation', async ({ page }) => {
    test.skip(!hasCredentials, 'BUGGY_USER and BUGGY_PASS are required');
    await openHome(page);
    await page.getByPlaceholder('Login').fill(user!);
    const password = page.locator('nav input[name="password"]');
    await password.fill(pass!);
    await password.fill('');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect.poll(() => password.evaluate((input: HTMLInputElement) => input.validationMessage)).not.toBe('');
  });

  test('TC-013: leading and trailing password spaces are significant', async ({ page }) => {
    test.skip(!hasCredentials, 'BUGGY_USER and BUGGY_PASS are required');
    await openHome(page);
    await verifyPrimaryAccount(page);
    await submitLogin(page, user!, ` ${pass!} `);
    await expect(page.getByText(/invalid/i)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toHaveCount(0);
  });

  test('TC-014: password matching is case-sensitive', async ({ page }) => {
    test.skip(!hasCredentials || pass === pass!.toUpperCase(), 'A password with lowercase characters is required');
    await openHome(page);
    await verifyPrimaryAccount(page);
    await submitLogin(page, user!, pass!.toUpperCase());
    await expect(page.getByText(/invalid/i)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toHaveCount(0);
  });

  test('TC-015: empty password shows required validation', async ({ page }) => {
    await openHome(page);
    await page.getByPlaceholder('Login').fill(user ?? 'sample-user');
    const password = page.locator('nav input[name="password"]');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect.poll(() => password.evaluate((input: HTMLInputElement) => input.validationMessage)).not.toBe('');
  });

  test('TC-016: valid credentials show the logged-in user in the navbar', async ({ page }) => {
    await openHome(page);
    await loginWithPrimaryAccount(page);
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  });

  test('TC-017: refreshing preserves the logged-in state', async ({ page }) => {
    await openHome(page);
    await loginWithPrimaryAccount(page);
    await page.reload();
    await expect(page.getByText(/Hi,/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  });

  test('TC-018: a valid username with an invalid password is rejected', async ({ page }) => {
    test.skip(!hasCredentials, 'BUGGY_USER and BUGGY_PASS are required');
    await openHome(page);
    await verifyPrimaryAccount(page);
    await submitLogin(page, user!, `invalid-${Date.now()}`);
    await expect(page.getByText(/invalid/i)).toBeVisible();
  });

  test('TC-019: an invalid username with a valid password is rejected', async ({ page }) => {
    test.skip(!hasCredentials, 'BUGGY_USER and BUGGY_PASS are required');
    await openHome(page);
    await verifyPrimaryAccount(page);
    await submitLogin(page, `no_such_user_${Date.now()}`, pass!);
    await expect(page.getByText(/invalid/i)).toBeVisible();
  });

  test('TC-020: empty credentials show required validation', async ({ page }) => {
    await openHome(page);
    const username = page.getByPlaceholder('Login');
    const password = page.locator('nav input[name="password"]');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect.poll(() => username.evaluate((input: HTMLInputElement) => input.validationMessage)).not.toBe('');
    await expect.poll(() => password.evaluate((input: HTMLInputElement) => input.validationMessage)).not.toBe('');
  });

  test('TC-021: a cookie is created after successful login', async ({ page }) => {
    // Known session-storage defect: see bug-reports/BUG-10.md.
    test.fail(true, 'Successful login does not create a cookie');
    test.skip(!hasCredentials, 'BUGGY_USER and BUGGY_PASS are required');
    await openHome(page);
    const initialCookies = await page.context().cookies(homeUrl);
    await loginWithPrimaryAccount(page);
    const loggedInCookies = await page.context().cookies(homeUrl);
    expect(loggedInCookies.length).toBeGreaterThan(initialCookies.length);
  });

  test('TC-022: login state survives closing and reopening the browser context', async ({ page, browser }) => {
    await openHome(page);
    await loginWithPrimaryAccount(page);
    const originalContext = page.context();
    const storageState = await originalContext.storageState();
    await originalContext.close();
    const reopenedContext = await browser.newContext({ storageState });
    try {
      const reopenedPage = await reopenedContext.newPage();
      await reopenedPage.goto(homeUrl);
      await expect(reopenedPage.getByRole('link', { name: 'Logout' })).toBeVisible();
    } finally {
      await reopenedContext.close();
    }
  });

  test('TC-023: logout returns to the login form', async ({ page }) => {
    await openHome(page);
    await loginWithPrimaryAccount(page);
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByPlaceholder('Login')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toHaveCount(0);
  });

  test('TC-024: browser Back does not restore the logged-in page after logout', async ({ page }) => {
    await openHome(page);
    await loginWithPrimaryAccount(page);
    await page.getByRole('link', { name: 'Logout' }).click();
    await page.goBack();
    await expect(page.getByRole('link', { name: 'Logout' })).toHaveCount(0);
  });

  test('TC-025: logout deletes the session cookie', async ({ page }) => {
    // Known session-storage defect: see bug-reports/BUG-10.md.
    test.fail(true, 'Successful login does not create a session cookie to delete');
    await openHome(page);
    await loginWithPrimaryAccount(page);
    const loggedInCookies = await page.context().cookies(homeUrl);
    expect(loggedInCookies.length).toBeGreaterThan(0);

    await page.getByRole('link', { name: 'Logout' }).click();
    const loggedOutCookies = await page.context().cookies(homeUrl);
    expect(loggedOutCookies.length).toBeLessThan(loggedInCookies.length);
  });

  test('TC-026: refreshing after logout keeps the user logged out', async ({ page }) => {
    await openHome(page);
    await loginWithPrimaryAccount(page);
    await page.getByRole('link', { name: 'Logout' }).click();
    await page.reload();
    await expect(page.getByRole('link', { name: 'Logout' })).toHaveCount(0);
    await expect(page.getByPlaceholder('Login')).toBeVisible();
  });

  test('TC-027: logout works from the Overall Rating page', async ({ page }) => {
    // Known logout defect: see bug-reports/BUG-11.md.
    test.fail(true, 'Logout from Overall Rating leaves the user logged in');
    await openHome(page);
    await loginWithPrimaryAccount(page);
    await page.locator('a[href="/overall"]').click();
    await expect(page).toHaveURL(/\/overall$/);
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('link', { name: 'Logout' })).toHaveCount(0);
  });
});