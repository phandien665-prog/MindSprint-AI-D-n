// Generate a synthetic exercise image for opt-in live OCR checks; no user data.
const path = require('node:path');
const fs = require('node:fs');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require('../MindSprint.Api/bin/Debug/net8.0/.playwright/package')); }
(async () => {
    const browser = await chromium.launch({executablePath: process.env.TUTOR_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless:true});
    try {
        const page = await browser.newPage({viewport:{width:1100,height:600}});
        await page.setContent(`<html lang="vi"><style>body{padding:32px;font:26px Arial;line-height:1.8;background:white;color:black}h1{font-size:30px}.fraction{display:inline-flex;vertical-align:middle;flex-direction:column;text-align:center;line-height:1.1}.fraction span:first-child{border-bottom:2px solid}</style><h1>ĐỀ BÀI LUYỆN TẬP</h1><p>Câu 1. Giải phương trình 2x + 3 = 11.</p><p>Câu 2. Tính A = <span class="fraction"><span>1</span><span>2</span></span> + √4 và viết x².</p><p>Câu 3. Một hình chữ nhật có chiều dài 8 cm,<br>chiều rộng 5 cm. Tính diện tích hình chữ nhật.</p></html>`);
        const dir = path.join(__dirname,'bin','ocr-fixtures'); fs.mkdirSync(dir,{recursive:true});
        const png = await page.screenshot({path:path.join(dir,'vietnamese.png')});
        await page.screenshot({path:path.join(dir,'vietnamese.jpg'),quality:95});
        const webp = await page.evaluate(async base64 => {
            const img = new Image(); img.src = 'data:image/png;base64,' + base64; await img.decode();
            const canvas = document.createElement('canvas'); canvas.width=img.width; canvas.height=img.height;
            canvas.getContext('2d').drawImage(img,0,0); return canvas.toDataURL('image/webp',1).split(',')[1];
        },png.toString('base64'));
        fs.writeFileSync(path.join(dir,'vietnamese.webp'),Buffer.from(webp,'base64'));
        console.log('Created synthetic OCR fixture in TutorChecks/bin/ocr-fixtures');
    } finally {await browser.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
