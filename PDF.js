const puppeteer = require('puppeteer');

async function generatePDF() {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ejemplo de generación de PDF</title>
    </head>
    <body>
      <h1>¡Hola, Mundo!</h1>
      <p>Este es un ejemplo de página HTML generada con Puppeteer.</p>
    </body>
    </html>
  `;

  const outputPath = 'output.pdf';

  const browser = await puppeteer.launch({ headless: "new" }); // Aquí se pasa la opción "headless: "new""
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPath, format: 'Letter' });

  await browser.close();

  console.log(`PDF generado exitosamente en: ${outputPath}`);
}

generatePDF().catch(error => {
  console.error('Error al generar el PDF:', error);
});

module.exports = {
  generatePDF
};