import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
    private readonly usernameInput = '#user-name';
    private readonly passwordInput = '#password';
    private readonly loginButton = '#login-button';
    private readonly errorMessage = '[data-test="error"]';
    private readonly errorButton = '.error-button';

    constructor(page: Page) {
        super(page);
    }

    async navigateToLogin(): Promise<void> {
        await this.goto('/');
    }

    async enterUsername(username: string): Promise<void> {
        await this.fill(this.usernameInput, username);
    }

    async enterPassword(password: string): Promise<void> {
        await this.fill(this.passwordInput, password);
    }

    async clickLoginButton(): Promise<void> {
        await this.click(this.loginButton);
    }


    async login(username: string, password: string): Promise<void> {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }


    async isErrorMessageVisible(): Promise<boolean> {
        return await this.isVisible(this.errorMessage);
    }

    async getErrorMessage(): Promise<string> {
        await this.waitForSelector(this.errorMessage);
        return await this.getText(this.errorMessage);
    }

  
    async errorContainsText(expectedText: string): Promise<boolean> {
        const errorText = await this.getErrorMessage();
        return errorText.includes(expectedText);
    }

    

    
    
}