const puppeteer = require('puppeteer');
const fs = require('fs');
//-------------------------IMAGENES--------------------------------------
const base64Image = fs.readFileSync(`${process.cwd()}\\public\\images\\LogoReducido.jpg`).toString('base64');
const imageSrc = `data:image/png;base64,${base64Image}`;
//-------------------------CSS-------------------------------------------
const cssContent = `<style> ${fs.readFileSync(`${process.cwd()}\\public\\stylesheets\\PDF.css`, 'utf-8')} </style>`;
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
        <div class="Tres_Columnas_Header">
            <div class="logo">
                <img src="${imageSrc}" alt="Logo de la empresa">
            </div>  
            <div class="Titulo">
                <center><b><p style="font-size: 1rem;">"INSTITUTO CANADIENSE CLARAC"</p></b><p>RESPONSIVA DE EQUIPO DE CÓMPUTO</p></center>
            </div>
            <div style="float:right; width: auto;">
                <b>FECHA: </b>10-Junio-23
            </div>
        </div><hr>
        <div class="Dos_Columnas_Separado">
            <div>
                <label><b>Nombre:</b></label>

            </div>
            <div>
                <label><b>No. Empleado:</b></label>
            </div>
        </div>
        <div class="Tres_Columnas">
            <div>
                <label><b>Cargo:</b></label>
            </div>
            <div>
                <label><b>Depto.:</b></label>
            </div>
            <div>
                <label><b>Area:</b></label>
            </div>
        </div>
        </header>
        <main class="Seccion">
            
        </main>
    </body>
    </html>
    `;

    const outputPath = 'output.pdf';

    const browser = await puppeteer.launch({ headless: "new" }); // Aquí se pasa la opción "headless: "new""
    const page = await browser.newPage();

    //await page.setContent({ content: cssContent });

    await page.setContent((cssContent + htmlContent), { waitUntil: 'domcontentloaded' });

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