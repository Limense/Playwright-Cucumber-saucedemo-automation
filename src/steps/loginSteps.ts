import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

// Step Definitions para Login

// Given
Given(
  "el usuario está en la página de login",
  async function (this: CustomWorld) {
    await this.loginPage.navigateToLogin();
  },
);

// When
When(
  "el usuario ingresa credenciales válidas de usuario estándar",
  async function (this: CustomWorld) {
    await this.loginPage.login(
      process.env.STANDARD_USER!,
      process.env.PASSWORD!,
    );
  },
);

When(
  "el usuario ingresa credenciales de usuario bloqueado",
  async function (this: CustomWorld) {
    await this.loginPage.login(process.env.LOCKED_USER!, process.env.PASSWORD!);
  },
);

When(
  "el usuario ingresa credenciales inválidas",
  async function (this: CustomWorld) {
    await this.loginPage.login("usuario_invalido", "password_incorrecto");
  },
);

// Then
Then(
  "el usuario debería ver la página de productos",
  async function (this: CustomWorld) {
    await this.productsPage.waitForProductsPage();
    const isDisplayed = await this.productsPage.isProductsPageDisplayed();
    expect(isDisplayed).toBeTruthy();
  },
);

Then(
  "el título de la página debería ser {string}",
  async function (this: CustomWorld, expectedTitle: string) {
    const actualTitle = await this.productsPage.getPageTitle();
    expect(actualTitle).toBe(expectedTitle);
  },
);

Then(
  "el usuario debería ver un mensaje de error",
  async function (this: CustomWorld) {
    const isErrorVisible = await this.loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBeTruthy();
  },
);

Then(
  "el mensaje de error debería contener {string}",
  async function (this: CustomWorld, expectedText: string) {
    const errorMessage = await this.loginPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain(expectedText.toLowerCase());
  },
);
