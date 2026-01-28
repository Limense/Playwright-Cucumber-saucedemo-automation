import { Before, After, Status, BeforeAll, AfterAll } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import dotenv from "dotenv";

dotenv.config();

BeforeAll(async function () {
  console.log("Iniciando ejecución de tests...");
  console.log(`Ambiente: ${process.env.ENVIRONMENT}`);
  console.log(`URL Base: ${process.env.BASE_URL}`);
  console.log(`Headless: ${process.env.HEADLESS}`);
  console.log("-------------------------------------------\n");
});

Before(async function (this: CustomWorld, { pickle }) {
  // Inicializar el navegador y las páginas
  await this.init();

  console.log(`\n Ejecutando escenario: ${pickle.name}`);
});

After(async function (this: CustomWorld, { pickle, result }) {
  // Si el escenario falló, tomar screenshot
  if (result?.status === Status.FAILED) {
    console.log(`El escenario "${pickle.name}" ha fallado.`);

    const screenshot = await this.page.screenshot({
      path: `reports/screenshots/failed/${pickle.name.replace(/\s+/g, "_")}_${Date.now()}.png`,
      fullPage: true,
    });

    this.attach(screenshot, "image/png");
    console.log(`Screenshot de fallo guardado en: reports/screenshots/failed/`);
  } else if (result?.status === Status.PASSED) {
    console.log(`El escenario "${pickle.name}" ha pasado exitosamente.`);
    
    // Tomar screenshot también cuando pasa
    const screenshot = await this.page.screenshot({
      path: `reports/screenshots/passed/${pickle.name.replace(/\s+/g, "_")}_${Date.now()}.png`,
      fullPage: true,
    });
    
    this.attach(screenshot, "image/png");
    console.log(`Screenshot de éxito guardado en: reports/screenshots/passed/`);
  }
  await this.cleanup();
});

AfterAll(async function () {
  console.log("Ejecución de tests completada");
  console.log('chekea en carperta de reports');
});
