const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
var contador = 1;

const base64Image = fs.readFileSync(`${process.cwd()}\\public\\images\\LogoReducido.jpg`).toString('base64');
const imageSrc = `data:image/png;base64,${base64Image}`;

const cssContent = fs.readFileSync(`${process.cwd()}\\public\\stylesheets/PDF_equipos.css`, 'utf-8');

// Fecha para generar responsiva
const date = new Date();
let fechaDia = date.getDate();
let fechaMes = date.getMonth() + 1;
let fechaAño = date.getFullYear();
let fechaHora = date.getHours();
let fechaMinutos = date.getMinutes();

if (fechaMes < 10) {
    fechaMes = "0" + fechaMes;
}
if (fechaDia < 10) {
    fechaDia = "0" + fechaDia;
}

// Variables de fechas
let nombreArchivo = "Alta_equipos" + "-" + fechaDia + "_" + fechaMes + "_" + fechaAño + "--" + fechaHora + "-" + fechaMinutos;
let fecha_eqp = fechaDia + "/" + fechaMes + "/" + fechaAño;

async function equipos_generatePDF(num_emp, areaEmp, NombreEmp, eqpsData) {
    const equipos = eqpsData || [];

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

    equipos.forEach(equi => {
        console.log(equi);
        console.log(equi.Monitor);
        if (equi.Teclado == null) equi.Teclado = '-';
        if (equi.Mouse == null) equi.Mouse = '-';
        if (equi.Accesorio == null) equi.Accesorio = '-';
        if (equi.Monitor == null) equi.Monitor = '-';
        if (equi.Num_Serie_Monitor == null) equi.Num_Serie_Monitor = '-';
        if (equi.Num_Inv_Mon == null) equi.Num_Inv_Mon = '-';
        htmlContent +=
            `<tr>
                        <td>${equi.N_Inventario}</td>
                        <td>${equi.Num_Serie}</td>
                        <td>${equi.Equipo}</td>
                        <td>${equi.Marca}</td>
                        <td>${equi.Modelo}</td>
                        <td>${equi.Teclado}</td>
                        <td>${equi.Mouse}</td>
                        <td>${equi.Accesorio}</td>
                        <td>${equi.Monitor}</td>
                        <td>${equi.Num_Serie_Monitor}</td>
                        <td>${equi.Num_Inv_Mon}</td>
                    </tr>`;
    });

    htmlContent += `
                    </tbody>
                </table>
            </main>
    </body>
    </html>
    `;

    //Ruta del archivo
    var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');
    const pathPDF = path.join(DOWNLOAD_DIR, nombreArchivo + '_' + contador + '.pdf');

    contador++;

    const outputPath = pathPDF;

    const browser = await puppeteer.launch({
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

    await page.pdf({
        path: outputPath,
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
                        <center><b><p style="width: 100%; font-size: 10px;">"INSTITUTO CANADIENSE CLARAC"</p></b><p>RESPONSIVA DE MOBILIARIO</p></center>
                    </div>
                    <div style="flex: 1; padding: 0 32px; float:right; width: auto;">
                        <b>FECHA: </b>${fecha_eqp}
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
                            <th>No. INVENTARIO</th>
                            <th>No. SERIE</th>
                            <th>EQUIPO</th>
                            <th>MARCA</th>
                            <th>MODELO</th>
                            <th>TECLA</th>
                            <th>MOUSE</th>
                            <th>ACCESORIO</th>
                            <th>MONITOR</th>
                            <th>N/S MONITOR</th>
                            <th>N/I MONITOR</th>
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

    console.log(`PDF generado exitosamente en: ${outputPath}`);
}

module.exports = {
    equipos_generatePDF
};