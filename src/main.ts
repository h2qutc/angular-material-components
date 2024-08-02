import { enableProdMode, isDevMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

function bootstrap() {
  bootstrapApplication(AppComponent, appConfig).catch(console.error);
}

if (!isDevMode()) {
  enableProdMode();
}

if (document.readyState === "complete") {
  bootstrap();
} else {
  document.addEventListener("DOMContentLoaded", bootstrap);
}
