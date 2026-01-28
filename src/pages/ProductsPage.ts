import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
  private readonly inventoryContainer = ".inventory_container";
  private readonly inventoryList = ".inventory_list";
  private readonly pageTitle = ".title";
  private readonly shoppingCartBadge = ".shopping_cart_badge";
  private readonly shoppingCartLink = ".shopping_cart_link";

  // dinamicos
  private readonly productName = ".inventory_item_name";
  private readonly addToCartButton = (productName: string) =>
    `//div[text()="${productName}"]/ancestor::div[@class="inventory_item"]//button[contains(@id, "add-to-cart")]`;
  private readonly removeButton = (productName: string) =>
    `//div[text()="${productName}"]/ancestor::div[@class="inventory_item"]//button[contains(@id, "remove")]`;

  constructor(page: Page) {
    super(page);
  }

  async isProductsPageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.inventoryContainer);
  }

  async getPageTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  async waitForProductsPage(): Promise<void> {
    await this.waitForSelector(this.inventoryList);
  }

  async addProductToCart(productName: string): Promise<void> {
    const addButton = this.addToCartButton(productName);
    await this.click(addButton);
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const removeBtn = this.removeButton(productName);
    await this.click(removeBtn);
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const removeBtn = this.removeButton(productName);
    return await this.isVisible(removeBtn);
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.isVisible(this.shoppingCartBadge);
    if (!isVisible) {
      return 0;
    }
    const text = await this.getText(this.shoppingCartBadge);
    return parseInt(text);
  }

  async goToCart(): Promise<void> {
    await this.click(this.shoppingCartLink);
  }

  async getAllProductNames(): Promise<string[]> {
    const products = await this.page.locator(this.productName).all();
    const names: string[] = [];

    for (const product of products) {
      const name = await product.textContent();
      if (name) {
        names.push(name);
      }
    }

    return names;
  }

  async isProductDisplayed(productName: string): Promise<boolean> {
    const productLocator = `//div[text()="${productName}"]`;
    return await this.isVisible(productLocator);
  }
}
