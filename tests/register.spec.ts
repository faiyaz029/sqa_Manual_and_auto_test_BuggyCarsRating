import { test, expect } from '@playwright/test';

const registerUrl = 'https://buggy.justtestit.org/register';

test.describe('Register form UI', () => {
  test('TC-028: every registration input has a visible label', async ({ page }) => {
    await page.goto(registerUrl);

    for (const label of ['Login', 'First Name', 'Last Name', 'Password', 'Confirm Password']) {
      await expect(page.getByRole('textbox', { name: label, exact: true }).last()).toBeVisible();
    }
  });

  test('TC-029: Register button is visible and has hover and active states', async ({ page }) => {
    // Known visual defect: see bug-reports/BUG-08.md.
    test.fail(true, 'Register button has no hover visual state');
    await page.goto(registerUrl);
    await page.getByLabel('Login').last().fill(`tc029_${Date.now()}`);
    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Case');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('SamplePass1');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('SamplePass1');

    const register = page.getByRole('button', { name: 'Register' });
    await expect(register).toBeVisible();
    await expect(register).toBeEnabled();

    const style = () => register.evaluate(element => {
      const computed = getComputedStyle(element);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        borderColor: computed.borderColor,
        boxShadow: computed.boxShadow,
      };
    });

    const beforeHover = await style();
    expect(beforeHover.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    await register.hover();
    const hover = await style();
    expect(hover).not.toEqual(beforeHover);

    const box = await register.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    const active = await style();
    await page.mouse.move(0, 0);
    await page.mouse.up();
    expect(active).not.toEqual(hover);
  });
});