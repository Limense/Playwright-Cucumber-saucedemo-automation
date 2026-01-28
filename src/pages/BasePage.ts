import { Page, Locator } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async click(locator: string | Locator): Promise<void> {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await element.click();
    }

    async fill(locator: string | Locator, text: string): Promise<void> {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await element.fill(text);
    }

    async getText(locator: string | Locator): Promise<string> {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        return await element.textContent() || '';
    }

    async isVisible(locator: string | Locator): Promise<boolean> {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        return await element.isVisible();
    }

    async waitForSelector(locator: string | Locator): Promise<void> {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await element.waitFor({ state: 'visible' });
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async getURL(): Promise<string> {
        return this.page.url();
    }

    async wait(milliseconds: number): Promise<void> {
        await this.page.waitForTimeout(milliseconds);
    }
}