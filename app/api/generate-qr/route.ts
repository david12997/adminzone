export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import { DB } from '@/db/config';
import QRCode from 'qrcode';
import { PDFDocument, rgb } from 'pdf-lib';

export async function GET(req: Request) {
    try {

        /**
         * we obtain the @limit and @offset parameters from the URL query string
         * and the @token parameter to authenticate the request
         * 
         */
        const limit = new URL(req.url).searchParams.get('limit'); 
        const offset = new URL(req.url).searchParams.get('offset');
        const authToken = new URL(req.url).searchParams.get('token');

        /**
         * we validate that the parameters are present in the URL query string
         */
        if (!limit || !offset) return NextResponse.json({ status: 400, message: 'Missing pagination parameters' });
        if (!authToken) return NextResponse.json({ status: 401, message: 'Unauthorized' });

        /**
         * we validate the authentication token in the database
         */
        const [rows]: any[] = await DB.query('SELECT * FROM directus_users WHERE token = ?', [authToken]);
        if (rows.length === 0) return NextResponse.json({ status: 401, message: 'Unauthorized' });


        /**
         * we obtain the products from the database using the @limit and @offset parameters
         */
        const [products]: any[] = await DB.query('SELECT * FROM product WHERE name NOT LIKE ? LIMIT ? OFFSET ?', ["%LEGACY%",parseInt(limit), parseInt(offset)]);

        /**
         * create a PDF document and add a page to it
         */
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage();

        /**
         * we obtain the width and height of the page
         */
        const { width, height } = page.getSize();
        const fontSize = 8;

        const qrSize = 100; // size of the QR code
        const margin = 15; // margin between QR codes
        const columns = 4; // columns of QR codes per page
        const startX = 50;  
        const startY = height - 50;
        let xPosition = startX;
        let yPosition = startY;
        let count = 0;

        /**
         * we iterate over the products and generate a QR code for each one
         */
        for (const product of products) {
            let dataQr = {
                id: product.id,
                
            };

            let qrString = JSON.stringify(dataQr);
            
           // we generate the QR code as a data URL
            const qrCodeDataUrl = await QRCode.toDataURL(qrString, {
                version: 1,                   // we use version 1 of the QR code to mantain a small size and simplify the scanning
                errorCorrectionLevel: 'L',    // low error correction level to mantain a small size
                margin: 4,                    // Margin of 4 modules
                scale: 6                      // Scale of 6 pixels per module
            });
            

            /**
             * we embed the QR code image in the PDF document
             * and draw the product name below the QR code
             * 
             */
            const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);

            page.drawImage(qrImage, {
                x: xPosition,
                y: yPosition - qrSize,
                width: qrSize,
                height: qrSize,
            });

            // Truncate the product name if it's too long
            const truncatedName = product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name;

            page.drawText(truncatedName, {
                x: xPosition,
                y: yPosition - qrSize - fontSize,
                size: fontSize,
                color: rgb(0, 0, 0),
            });

            count++;
            xPosition += qrSize + margin;

            if (count % columns === 0) {
                xPosition = startX;
                yPosition -= qrSize + fontSize + margin;
            }

            if (yPosition < 100) {
                page = pdfDoc.addPage();
                yPosition = height - 50;
                xPosition = startX;
                count = 0;
            }
        }

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(pdfBytes, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=products.pdf'
            },
            status: 200
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ status: 500, message: 'Internal Server Error' });
    }
}
//http://localhost:3006/api/generate-qr?limit=50&offset=0&token=JGQPC3fuRgXCtpNjShZQGnzC