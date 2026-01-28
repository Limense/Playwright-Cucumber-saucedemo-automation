import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage {
  // ========== CHECKOUT STEP ONE (Información del usuario) ==========
  private readonly firstNameInput = "#first-name";
  private readonly lastNameInput = "#last-name";
  private readonly postalCodeInput = "#postal-code";
  private readonly continueButton = "#continue";
  private readonly cancelButton = "#cancel";
  private readonly errorMessage = '[data-test="error"]';

  // ========== CHECKOUT STEP TWO (Resumen de la orden) ==========
  private readonly summaryContainer = ".checkout_summary_container";
  private readonly summaryItemName = ".inventory_item_name";
  private readonly summarySubtotal = ".summary_subtotal_label";
  private readonly summaryTax = ".summary_tax_label";
  private readonly summaryTotal = ".summary_total_label";
  private readonly finishButton = "#finish";

  // ========== CHECKOUT COMPLETE (Confirmación) ==========
  private readonly completeHeader = ".complete-header";
  private readonly completeText = ".complete-text";
  private readonly backHomeButton = "#back-to-products";
  private readonly ponyExpressImage = ".pony_express";

  constructor(page: Page) {
    super(page);
  }

  // Método del primer paso, para llenar la información del usuario

  async fillCheckoutInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  async enterFirstName(firstName: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.fill(this.lastNameInput, lastName);
  }

  async enterPostalCode(postalCode: string): Promise<void> {
    await this.fill(this.postalCodeInput, postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.click(this.continueButton);
  }

  async clickCancel(): Promise<void> {
    await this.click(this.cancelButton);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForSelector(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  // Métodos del segundo paso, para verificar el resumen de la orden

  async isCheckoutSummaryDisplayed(): Promise<boolean> {
    return await this.isVisible(this.summaryContainer);
  }

  async waitForCheckoutSummary(): Promise<void> {
    await this.waitForSelector(this.summaryContainer);
  }

  async getSummaryProductNames(): Promise<string[]> {
    const products = await this.page.locator(this.summaryItemName).all();
    const names: string[] = [];

    for (const product of products) {
      const name = await product.textContent();
      if (name) {
        names.push(name);
      }
    }

    return names;
  }

  async getSubtotal(): Promise<string> {
    return await this.getText(this.summarySubtotal);
  }

  async getTax(): Promise<string> {
    return await this.getText(this.summaryTax);
  }

  async getTotal(): Promise<string> {
    return await this.getText(this.summaryTotal);
  }

  extractPrice(priceText: string): number {
    const match = priceText.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async clickFinish(): Promise<void> {
    await this.click(this.finishButton);
  }

  // Métodos del tercer paso, para la confirmación de la orden
  async isOrderComplete(): Promise<boolean> {
    return await this.isVisible(this.completeHeader);
  }

  async waitForOrderComplete(): Promise<void> {
    await this.waitForSelector(this.completeHeader);
  }

  async getCompleteHeader(): Promise<string> {
    return await this.getText(this.completeHeader);
  }

  async getCompleteText(): Promise<string> {
    return await this.getText(this.completeText);
  }

  async isConfirmationImageVisible(): Promise<boolean> {
    return await this.isVisible(this.ponyExpressImage);
  }

  async clickBackHome(): Promise<void> {
    await this.click(this.backHomeButton);
  }

  // Flujo completo
  async completeCheckout(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    // Step One: Llenar información
    await this.fillCheckoutInformation(firstName, lastName, postalCode);
    await this.clickContinue();

    // Step Two: Confirmar orden
    await this.waitForCheckoutSummary();
    await this.clickFinish();

    // Complete: Esperar confirmación
    await this.waitForOrderComplete();
  }
}
