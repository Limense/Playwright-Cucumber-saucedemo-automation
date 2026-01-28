import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';


dotenv.config();

export default defineConfig({
    testDir: './src',
    timeout: parseInt(process.env.TEST_TIMEOUT || '60000'),
    expect: {
        timeout: 10000
    },
    reporter: 'list',
    use: {
        baseURL: process.env.BASE_URL,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        actionTimeout: parseInt(process.env.ACTION_TIMEOUT || '15000'),
        navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
    },

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: {
                    width: parseInt(process.env.VIEWPORT_WIDTH || '1920'),
                    height: parseInt(process.env.VIEWPORT_HEIGHT || '1080')
                },
                headless: process.env.HEADLESS === 'true',
            },
        },
    ],
});