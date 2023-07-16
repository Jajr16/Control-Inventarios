const puppeteer = require('puppeteer');
const fs = require('fs');
//-------------------------IMAGENES--------------------------------------
const base64Image = fs.readFileSync(`${process.cwd()}\\public\\images\\LogoReducido.jpg`).toString('base64');
const imageSrc = `data:image/png;base64,${base64Image}`;
//-------------------------CSS-------------------------------------------
const cssContent = `<style> ${fs.readFileSync(`${process.cwd()}\\public\\stylesheets\\PDF.css`, 'utf-8')} </style>`;
//-------------------------FUNCIÓN---------------------------------------
async function Equipos_generatePDF(num_emp, areaEmp, NombreEmp, eqpData) {
    const equipos = eqpData || [];

    var htmlContent = `
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
    </head>
    
    <body>
        <header class="header">
            <div class="Tres_Columnas_Header">
                <div class="logo">
                    <img src="${imageSrc}" alt="Logo de la empresa">
                </div>  
                <div class="Titulo">
                    <center><b><p style="font-size: 1rem;">"INSTITUTO CANADIENSE CLARAC"</p></b><p>RESPONSIVA DE EQUIPOS</p></center>
                </div>
                <div style="float:right; width: auto;">
                    <b>FECHA: </b>10-Junio-23
                </div>
            </div><hr>
            <div class="Tres_Columnas_Header">
                <div style="width:40%">
                    <label><b>Nombre: </b></label>${NombreEmp}
                </div>
                <div style="width:40%">
                    <label><b>Área: </b></label>${areaEmp}
                </div>
                <div style="width:20%">
                    <label><b>No. Empleado: </b></label>${num_emp}
                </div>
            </div>
        </header>
        <main class="Seccion">
            <table>
                <thead>
                    <tr id="firstrow">
                        <th>Número de Inventario</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>`;

    equipos.forEach(eqps => {
        htmlContent +=
            `<tr>
                        <td>${eqps.Num_Inventario}</td>
                        <td>${eqps.Descripcion}</td>
                    </tr>`;
    });
    htmlContent += `
                </tbody>
            </table>
        </main>
    </body>
    </html>
    `;

    const outputPath = 'outputEqp.pdf';

    const browser = await puppeteer.launch({ headless: "new" }); // Aquí se pasa la opción "headless: "new""
    const page = await browser.newPage();

    //await page.setContent({ content: cssContent });

    await page.setContent((cssContent + htmlContent), { waitUntil: 'domcontentloaded' });

    const options = {
        format: 'Letter',
        displayHeaderFooter: true,
        headerTemplate: `
    
        `,
    };

    await page.pdf({ path: outputPath, ...options });

    await browser.close();

    console.log(`PDF generado exitosamente en: ${outputPath}`);
}

Equipos_generatePDF().catch(error => {
    console.error('Error al generar el PDF:', error);
});

module.exports = {
    Equipos_generatePDF
};