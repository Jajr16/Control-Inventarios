const puppeteer = require('puppeteer');
const fs = require('fs');

const base64Image = fs.readFileSync(`${process.cwd()}\\public\\images\\LogoReducido.jpg`).toString('base64');
const imageSrc = `data:image/png;base64,${base64Image}`;

const cssContent = fs.readFileSync(`${process.cwd()}\\public\\stylesheets/PDF_soli_alma.css`, 'utf-8');

// Fecha para generar responsiva
const date = new Date();
let fechaDia = date.getDate();
let fechaMes = date.getMonth() + 1;
let fechaAño = date.getFullYear();

if (fechaMes < 10) {
    fechaMes = "0" + fechaMes;
}
if (fechaDia < 10) {
    fechaDia = "0" + fechaDia;
}

let fecha_soli = fechaDia + "/" + fechaMes + "/" + fechaAño;

async function soli_alma_generatePDF(request_date, Cod_Barras_SC, Articulo, Marca, usuario, cantidad_SC, delivered, recibido) {
    const solici_alma = eqpsData || [];

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
        <style>${cssContent}</style>
    </head>
    <body>
        <style>
            table{
                border-collapse: collapse;
                margin-top: 10px;
            }

            th, td {
                border-top: 1px solid black;
                border-bottom: 1px solid black;
                width: 4%;
            }
        </style>
            <main class="Seccion">
                <table style="width: 100%; font-size: 4px;">               
                    <tbody>`;

    solici_alma.forEach(soli => {
        htmlContent +=
            `<tr>
                        <td>${soli.request_date}</td>
                        <td>${soli.Cod_Barras_SC}</td>
                        <td>${soli.Articulo}</td>
                        <td>${soli.Marca}</td>
                        <td>${soli.usuario}</td>
                        <td>${soli.cantidad_SC}</td>
                        <td>${soli.delivered}</td>
                        <td>${soli.recibido}</td>
                    </tr>`;
    });

    htmlContent += `
                    </tbody>
                </table>
            </main>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--disable-popup-blocking'],
        args: ['--disable-popup-blocking'],
        headless: "new",
        defaultViewport: {
            width: 750,
            height: 500,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: false,
            isLandscape: false,
        }
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    await page.addStyleTag({ content: cssContent });

    await page.emulateMediaType("screen");

    const pdfBuffer = await page.pdf({
        format: 'Letter',
        displayHeaderFooter: true,
        headerTemplate: `
        <style>
            table{
                border-collapse: collapse;
            }

            th {
                border-top: 2px solid black;
                border-bottom: 2px solid black;
                width: 4%;
            }
        </style>
        <div style="width: 100%;">
            <center style="width: 100%;">
            <div style="font-size: 5px; width: 100%;">
                <div style="padding-left: 5%; display: flex; border-bottom: solid 1px; justify-content: space-evenly; align-items: center; width: 100%;">
                    <div style="flex: 1; padding: 0 32px; float: left; max-width: 10%;">
                        <img src="${imageSrc}" height="80px" width="auto" alt="Logo de la empresa">
                    </div>  
                    <div style="flex: 1; padding-left: 10%; width: 80%;">
                        <center><b><p style="width: 100%; font-size: 10px;">"INSTITUTO CANADIENSE CLARAC"</p></b><p>RESPONSIVA DE EQUIPOS</p></center>
                    </div>
                    <div style="flex: 1; padding: 0 32px; float:right; width: auto;">
                        <b>FECHA: </b>${fecha_soli}
                    </div>
                </div>
                <div style="display: flex; justify-content: space-evenly; align-items: center; width: 100%;">
                    <div style="flex: 1; padding: 0 32px; width:40%">
                        <label style="display: block; font-weight: 700; text-transform: uppercase; margin-top: 10px;"><b>Nombre: </b></label>${NombreEmp}
                    </div>
                    <div style="flex: 1; padding: 0 32px; width:40%">
                        <label style="display: block; font-weight: 700; text-transform: uppercase; margin-top: 10px;"><b>Área: </b></label>${areaEmp}
                    </div>
                    <div style="flex: 1; padding: 0 32px; width:20%">
                        <label style="display: block; font-weight: 700; text-transform: uppercase; margin-top: 10px;"><b>No. Empleado: </b></label>${num_emp}
                    </div>
                </div>
            </div>
                <table style="font-size: 8px; padding-top: 10px; width: 95%;">
                    <thead>
                        <tr id="firstrow">
                            <th>Fecha</th>
                            <th>Código de barras</th>
                            <th>Nombre del artículo</th>
                            <th>Marca del artículo</th>
                            <th>Cantidad</th>
                            <th>Solicitante</th>
                            <th>Estatus de entrega</th>
                            <th>Recibido por solicitante</th>
                        </tr>
                    </thead>        
                </table>         
            </center>
        </div>
        `,
        footerTemplate: `
        <center style="font-size: 8px; display: flex; justify-content: space-evenly; align-items: center; width: 100%;">
            <div style="display: inline-flex; align-items: center; flex-direction: column; padding: 0 2rem; width:45%;">
                <div style="border-bottom: 1px solid; width: 100%;">.
                </div>
                <p><b>REALIZÓ</b></p>
            </div>
            <div style="display: inline-flex; align-items: center; flex-direction: column; padding: 0 2rem; width:45%;">
                <div style="border-bottom: 1px solid; width: 100%;">
                    <span>${NombreEmp}</span>
                </div>
                <p><b>RESPONSABLE</b></p>
            </div>
        </center>    
        `,
        printBackground: true,
        margin: { left: "0.5cm", top: "5.69cm", right: "0.5cm", bottom: "3cm" }
    });

    await browser.close();

    // Retorna el PDF buffer
    return pdfBuffer;
}

module.exports = {
    soli_alma_generatePDF
};