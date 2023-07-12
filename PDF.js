const puppeteer = require('puppeteer');
const fs = require('fs');
//-------------------------IMAGENES--------------------------------------
const base64Image = fs.readFileSync(`${process.cwd()}\\public\\images\\LogoReducido.jpg`).toString('base64');
const imageSrc = `data:image/png;base64,${base64Image}`;
//-------------------------CSS-------------------------------------------
const cssContent = fs.readFileSync('./public/stylesheets/general.css', 'utf-8');
//-------------------------FUNCIÓN---------------------------------------
async function generatePDF() {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>
            <%= title%>
        </title>
        <meta http-equiv="Expires" content="0">
        <meta http-equiv="Last-Modified" content="0">
        <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel='stylesheet' type="text/css" href='./public/stylesheets/general.css'/>    
    </head>
    
    <body>
        <header class="header">
        <div class="Tres_Column">
            <div class="logo">
                <img src="${imageSrc}" width="150" alt="Logo de la empresa">
            </div>
            <div>
                <center><b>"INSTITUTO CANADIENSE CLARAC"</b><br><p style="font-size:0.6rem">RESPONSIVA DE EQUIPO DE CÓMPUTO</p></center>
            </div>
            <div>
                <b>FECHA: </b> 10-Junio-23
            </div>
        </div><hr>
            
        </header>
        <main class="Seccion">
            
        </main>
    </body>
    </html>
    `;

    const outputPath = 'output.pdf';

    const browser = await puppeteer.launch({ headless: "new" }); // Aquí se pasa la opción "headless: "new""
    const page = await browser.newPage();

    await page.addStyleTag({ content: cssContent });

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