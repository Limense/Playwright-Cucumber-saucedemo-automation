import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Step Definition para Checkout(Proceso de compra)

// When
When('el usuario procede al checkout', async function (this: CustomWorld) {
  await this.cartPage.proceedToCheckout();
});

When('el usuario completa la información del checkout con:', async function (this: CustomWorld, dataTable) {
  // dataTable.hashes() convierte la tabla en array de objetos
  const data = dataTable.hashes()[0];
  
  await this.checkoutPage.fillCheckoutInformation(
    data.firstName,
    data.lastName,
    data.postalCode
  );
});

When('el usuario hace click en Continue en checkout', async function (this: CustomWorld) {
  await this.checkoutPage.clickContinue();
});

When('el usuario finaliza la compra', async function (this: CustomWorld) {
  await this.checkoutPage.clickFinish();
  await this.checkoutPage.waitForOrderComplete();
});

When('el usuario cancela el checkout', async function (this: CustomWorld) {
  await this.checkoutPage.clickCancel();
});

When('el usuario ingresa solo el nombre {string} en checkout', async function (this: CustomWorld, firstName: string) {
  await this.checkoutPage.enterFirstName(firstName);
});


// Then
Then('el usuario debería ver el resumen de la orden', async function (this: CustomWorld) {
  await this.checkoutPage.waitForCheckoutSummary();
  const isDisplayed = await this.checkoutPage.isCheckoutSummaryDisplayed();
  expect(isDisplayed).toBeTruthy();
});

Then('el producto {string} debería estar en el resumen', async function (this: CustomWorld, productName: string) {
  const products = await this.checkoutPage.getSummaryProductNames();
  expect(products).toContain(productName);
});

Then('el usuario debería ver la confirmación de la orden', async function (this: CustomWorld) {
  const isComplete = await this.checkoutPage.isOrderComplete();
  expect(isComplete).toBeTruthy();
});

Then('el mensaje de confirmación debería contener {string}', async function (this: CustomWorld, expectedText: string) {
  const header = await this.checkoutPage.getCompleteHeader();
  expect(header.toLowerCase()).toContain(expectedText.toLowerCase());
});

Then('el subtotal debería ser mayor a {string}', async function (this: CustomWorld, minValue: string) {
  const subtotalText = await this.checkoutPage.getSubtotal();
  const subtotal = this.checkoutPage.extractPrice(subtotalText);
  expect(subtotal).toBeGreaterThan(parseFloat(minValue));
});

Then('el impuesto debería ser mayor a {string}', async function (this: CustomWorld, minValue: string) {
  const taxText = await this.checkoutPage.getTax();
  const tax = this.checkoutPage.extractPrice(taxText);
  expect(tax).toBeGreaterThan(parseFloat(minValue));
});

Then('el total debería ser mayor al subtotal', async function (this: CustomWorld) {
  const subtotalText = await this.checkoutPage.getSubtotal();
  const totalText = await this.checkoutPage.getTotal();
  
  const subtotal = this.checkoutPage.extractPrice(subtotalText);
  const total = this.checkoutPage.extractPrice(totalText);
  
  expect(total).toBeGreaterThan(subtotal);
});