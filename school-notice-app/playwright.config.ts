import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5178',
    trace: 'on-first-retry',
    headless: true,
  },
  webServer: {
    command: 'npm run dev -- --port=5178',
    url: 'http://localhost:5178',
    reuseExistingServer: true,
    timeout: 60 * 1000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});