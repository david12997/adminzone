export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import { DB } from '@/db/config';
import QRCode from 'qrcode';
import { PDFDocument, rgb } from 'pdf-lib';

export async function GET(req: Request, res: Response) {
    try {
        const limit = new URL(req.url).searchParams.get('limit'); 
        const offset = new URL(req.url).searchParams.get('offset');
        const authToken = new URL(req.url).searchParams.get('token');

        if (!limit || !offset) return NextResponse.json({ status: 400, message: 'Missing pagination parameters' });
        if (!authToken) return NextResponse.json({ status: 401, message: 'Unauthorized' });

        const [rows]: any[] = await DB.query('SELECT * FROM directus_users WHERE token = ?', [authToken]);
        if (rows.length === 0) return NextResponse.json({ status: 401, message: 'Unauthorized' });

        const [products]: any[] = await DB.query('SELECT * FROM product LIMIT ? OFFSET ?', [parseInt(limit), parseInt(offset)]);

        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 8;
        
        const qrSize = 80;
        const margin = 15;
        const columns = 3;
        const startX = 50;
        const startY = height - 50;
        let xPosition = startX;
        let yPosition = startY;
        let count = 0;

        for (const product of products) {
            let dataQr = {
                id: product.id,
                name: product.name,
                base: product.base,
                unit_price: product.unit_price,
                combo_price: product.combo_price,
                mayor_price: product.mayor_price,
            };

            let qrString = JSON.stringify(dataQr);
            const qrCodeDataUrl = await QRCode.toDataURL(qrString, { errorCorrectionLevel: 'H' });
            const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
            
            page.drawImage(qrImage, {
                x: xPosition,
                y: yPosition - qrSize,
                width: qrSize,
                height: qrSize,
            });
            
            // Truncate product name if too long
            const truncatedName = product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name;

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
