import { test, expect } from '@playwright/test';

// Basic smoke test: open app, open settings, save dummy API key, open wizard modal
 test.describe('Settings and Wizard basic flow', () => {
  test('can open settings, save API key, and open wizard modal', async ({ page }) => {
    // Ensure clean state before app loads
    await page.addInitScript(() => {
      try {
        localStorage.clear();
      } catch {}
    });

    // Go to the root of the app (uses baseURL from playwright.config)
    await page.goto('/');

    // Settings button should be present (exact text with gear emoji)
    const settingsButton = page.getByRole('button', { name: '⚙️ 설정' });
    await expect(settingsButton).toBeVisible();

    // Open settings panel
    await settingsButton.click();

    // Scope to settings panel by data-testid to avoid duplicate matches
    const panel = page.getByTestId('settings-panel');
    await expect(panel).toBeVisible();

    // Find API key input by test id
    const apiKeyInput = panel.getByTestId('gemini-api-key-input');
    await expect(apiKeyInput).toBeVisible();

    // Fill Gemini API key (any non-empty string enables the wizard button)
    const dummyKey = 'dummy-key-for-tests';
    await apiKeyInput.fill(dummyKey);

    // Save settings within the panel
    await panel.getByRole('button', { name: '설정 저장' }).click();

    // Assert settings persisted in localStorage
    const storedKey = await page.evaluate(() => {
      try {
        const raw = localStorage.getItem('schoolNoticeSettings');
        const obj = raw ? JSON.parse(raw) : {};
        return obj.geminiApiKey || '';
      } catch {
        return '';
      }
    });
    expect(storedKey).toBe(dummyKey);

    // Close settings panel
    await panel.getByRole('button', { name: '닫기' }).click();

    // Open the AI wizard (button text contains "AI 통신문 마법사")
    const wizardOpenButton = page.getByRole('button', { name: /AI 통신문 마법사/ });
    await expect(wizardOpenButton).toBeEnabled();
    await wizardOpenButton.click();

    // Verify wizard modal title appears
    await expect(page.getByText('AI 전문 통신문 마법사')).toBeVisible();

    // Close wizard by clicking 취소
    await page.getByRole('button', { name: '취소' }).click();

    // Ensure wizard closed (title not visible)
    await expect(page.getByText('AI 전문 통신문 마법사')).toBeHidden();
  });
});

test.describe('Gemini API connection tests (mocked)', () => {
  test('API 연결 테스트 shows success message when /models returns 200', async ({ page }) => {
    // Ensure clean state and stub backend health
    await page.addInitScript(() => {
      try { localStorage.clear(); } catch {}
    });

    await page.route('**/api/health', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'OK' })
      });
    });

    // Mock Gemini models list endpoint to succeed
    await page.route('https://generativelanguage.googleapis.com/v1beta/models?**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ models: [{ name: 'models/gemini-1.5-flash' }] })
      });
    });

    await page.goto('/');

    // Open settings panel
    const settingsButton = page.getByRole('button', { name: '⚙️ 설정' });
    await settingsButton.click();
    const panel = page.getByTestId('settings-panel');
    await expect(panel).toBeVisible();

    // Fill a valid-looking Gemini API key (must start with AIza and be 39 chars)
    const validKey = 'AIza' + 'A'.repeat(35);
    await panel.getByTestId('gemini-api-key-input').fill(validKey);

    // Click API connection test button
    await panel.getByRole('button', { name: 'API 연결 테스트' }).click();

    // Expect success status message
    await expect(page.getByText('✅ Gemini API 연결이 성공했습니다!')).toBeVisible();
  });

  test('API 연결 테스트 shows failure message when /models returns 403', async ({ page }) => {
    // Clean state and stub backend health
    await page.addInitScript(() => {
      try { localStorage.clear(); } catch {}
    });

    await page.route('**/api/health', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'OK' })
      });
    });

    // Mock Gemini models list endpoint to return 403 (invalid key)
    await page.route('https://generativelanguage.googleapis.com/v1beta/models?**', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'Permission denied' } })
      });
    });

    await page.goto('/');

    // Open settings panel
    const settingsButton = page.getByRole('button', { name: '⚙️ 설정' });
    await settingsButton.click();
    const panel = page.getByTestId('settings-panel');
    await expect(panel).toBeVisible();

    // Fill a valid-looking key so client-side validation passes
    const validKey = 'AIza' + 'B'.repeat(35);
    await panel.getByTestId('gemini-api-key-input').fill(validKey);

    // Trigger API connection test
    await panel.getByRole('button', { name: 'API 연결 테스트' }).click();

    // Expect failure status message (prefix in Korean with error details)
    await expect(page.getByText(/API 연결 실패/)).toBeVisible();
  });
});