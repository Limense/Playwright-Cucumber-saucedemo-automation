import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

export class CustomWorld extends World {
  // Instancias de Playwright
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  // Page Objects - Instancias de nuestras páginas
  loginPage!: LoginPage;
  productsPage!: ProductsPage;
  cartPage!: CartPage;
  checkoutPage!: CheckoutPage;

  /**
   * Constructor - Se ejecuta para cada escenario
   * @param options - Opciones de configuración de Cucumber
   */
  constructor(options: IWorldOptions) {
    super(options);
  }

  async init(): Promise<void> {
    this.browser = await chromium.launch({
      headless: process.env.HEADLESS === "true",
      slowMo: 0,
    });

    this.context = await this.browser.newContext({
      baseURL: process.env.BASE_URL,  // baseURL para navegación
      viewport: {
        width: parseInt(process.env.VIEWPORT_WIDTH || "1920"),
        height: parseInt(process.env.VIEWPORT_HEIGHT || "1080"),
      },
      acceptDownloads: true,
      recordVideo:
        process.env.RECORD_VIDEO === "true" ? { dir: "videos/" } : undefined,
    });

    this.page = await this.context.newPage();

    this.page.setDefaultTimeout(
      parseInt(process.env.ACTION_TIMEOUT || "15000"),
    );
    this.page.setDefaultNavigationTimeout(
      parseInt(process.env.NAVIGATION_TIMEOUT || "30000"),
    );

    this.loginPage = new LoginPage(this.page);
    this.productsPage = new ProductsPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutPage = new CheckoutPage(this.page);
  }

  async cleanup(): Promise<void> {
    if (this.page) {
        await this.page.close();
    }

    if (this.context) {
        await this.context.close();
    }

    if (this.browser) {
        await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);
