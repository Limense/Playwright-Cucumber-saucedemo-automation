import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  private readonly cartList = ".cart_list";
  private readonly cartItem = ".cart_item";
  private readonly cartItemName = ".inventory_item_name";
  private readonly checkoutButton = "#checkout";
  private readonly continueShoppingButton = "#continue-shopping";
  private readonly pageTitle = ".title";

  private readonly removeButton = (productName: string) =>
    `//div[text()="${productName}"]/ancestor::div[@class="cart_item"]//button[contains(@id, "remove")]`;

  constructor(page: Page) {
    super(page);
  }

  async isCartPageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.cartList);
  }

  async getPageTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  async waitForCartPage(): Promise<void> {
    await this.waitForSelector(this.cartList);
  }

  async getCartProductNames(): Promise<string[]> {
    const products = await this.page.locator(this.cartItemName).all();
    const names: string[] = [];

    for (const product of products) {
      const name = await product.textContent();
      if (name) {
        names.push(name);
      }
    }

    return names;
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const productLocator = `//div[text()="${productName}"]`;
    return await this.isVisible(productLocator);
  }

  async getCartItemCount(): Promise<number> {
    const items = await this.page.locator(this.cartItem).all();
    return items.length;
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const removeBtn = this.removeButton(productName);
    await this.click(removeBtn);
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }

  async isCartEmpty(): Promise<boolean> {
    const items = await this.page.locator(this.cartItem).all();
    return items.length === 0;
  }
}
