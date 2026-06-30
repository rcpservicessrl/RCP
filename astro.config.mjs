// @ts-check
import { defineConfig } from 'astro/config';

// RCP Services — build estático para GitHub Pages
// output: 'static' genera HTML estático servible en GitHub Pages (rcp.services)
// build.format: 'directory' mantiene URLs /pagina/ (amigables) pero
// conservamos legacy .html para no romper enlaces existentes.
export default defineConfig({
  site: 'https://rcp.services',
  output: 'static',
  build: {
    // Mantiene /index.html, /nosotros/index.html, etc. — compatible con GitHub Pages
    format: 'directory',
  },
  // Los HTMLs viejos de la raíz (index.html, portal.html...) NO se procesan:
  // están en la raíz del repo. Astro solo compila src/pages/.
  // Moveremos los assets a /public para que el build los sirva intactos.
});
