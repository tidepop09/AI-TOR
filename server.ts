import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import mammoth from 'mammoth';
// @ts-ignore
import * as pdfParseModule from 'pdf-parse';
const pdfParse: any = (pdfParseModule as any).default || pdfParseModule;

const app = express();
const PORT = 3000;

// Middleware for JSON and base64 payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Endpoint to parse uploaded files (.docx, .pdf, .txt)
app.post('/api/parse-document', async (req, res) => {
  try {
    const { fileName, fileData, fileType } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'ไม่พบข้อมูลไฟล์ที่อัปโหลด' });
    }

    const buffer = Buffer.from(fileData, 'base64');
    let extractedText = '';

    const lowerName = (fileName || '').toLowerCase();
    if (lowerName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (lowerName.endsWith('.pdf')) {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (lowerName.endsWith('.txt') || fileType === 'text/plain') {
      extractedText = buffer.toString('utf-8');
    } else {
      // Fallback: try plain text decoding or pdfParse
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text;
      } catch {
        extractedText = buffer.toString('utf-8');
      }
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'ไม่สามารถสกัดข้อความจากเอกสารได้ หรือเอกสารไม่มีข้อความที่อ่านได้' });
    }

    res.json({
      success: true,
      fileName,
      charCount: extractedText.length,
      text: extractedText,
    });
  } catch (error: any) {
    console.error('Error parsing document:', error);
    res.status(500).json({ error: error.message || 'เกิดข้อผิดพลาดในการอ่านไฟล์' });
  }
});

// Endpoint to analyze TORs using Gemini API with strict document grounding
app.post('/api/analyze-tor', async (req, res) => {
  try {
    const { documents, customPrompt } = req.body;
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ error: 'โปรดระบุเอกสาร TOR อย่างน้อย 1 ฉบับเพื่อวิเคราะห์' });
    }

    const ai = getGeminiClient();

    // Prepare structured context from the provided documents only
    const docsContext = documents.map((doc: any, index: number) => `
========================================
[เอกสารที่ ${index + 1}]: ${doc.code || ''} - ${doc.title || ''}
- ชื่อ TOR: ${doc.title || 'ไม่ระบุ'}
- บริษัทหรือผู้ยื่นข้อเสนอ: ${doc.vendor || 'ไม่ระบุ'}
- ระยะเวลาดำเนินการ: ${doc.duration || 'ไม่ระบุ'}
- ขอบเขตการพัฒนาระบบ: ${doc.scope || 'ไม่ระบุ'}
- ซอฟต์แวร์และฮาร์ดแวร์: ${JSON.stringify(doc.hardwareSoftware || {})}
- การส่งมอบงานและงวดงาน: ${doc.delivery || 'ไม่ระบุ'}
- วงเงินงบประมาณ / ราคา: ${doc.priceFormatted || doc.price || 'ไม่ระบุ'}
- ความเชี่ยวชาญ/คุณสมบัติผู้ยื่น: ${doc.expertise || 'ไม่ระบุ'}
- การรับประกันและ SLA: ${doc.warrantyAndSla || 'ไม่ระบุ'}
- ข้อความจากเอกสารต้นฉบับ:
${(doc.rawText || '').slice(0, 4000)}
========================================
`).join('\n\n');

    const systemInstruction = `คุณคือ "ผู้เชี่ยวชาญด้านการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐและระบบความปลอดภัยอัจฉริยะ"
มีหน้าที่ช่วยเหลือเจ้าหน้าที่พัสดุและคณะกรรมการตรวจรับพัสดุในการวิเคราะห์และเปรียบเทียบข้อกำหนดของเอกสาร TOR ระบบตรวจจับทะเบียนรถ (License Plate Recognition - LPR)

กฎเหล็กสำคัญที่สุด (Strict Constraints):
1. คุณต้องวิเคราะห์ข้อมูลจาก "เอกสารที่กำหนดให้เท่านั้น" ห้ามต่อเติม คาดเดา หรืออ้างอิงข้อมูลภายนอกที่ไม่มีปรากฏในเอกสาร
2. ใช้ภาษาและสำนวนที่เป็นทางการ ถูกต้องตามระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560
3. วิเคราะห์เปรียบเทียบใน 8 ประเด็นหลัก:
   (1) ชื่อ TOR
   (2) บริษัทหรือผู้ยื่น TOR
   (3) ระยะเวลา
   (4) ขอบเขตการพัฒนาระบบ
   (5) ซอฟต์แวร์ ฮาร์ดแวร์ที่นำมาใช้
   (6) การส่งมอบงาน
   (7) ราคา
   (8) ความเชี่ยวชาญของบริษัทหรือผู้พัฒนา
4. ระบุ "ความเหมือน", "ความต่าง", "จุดเด่น (Highlights)", "จุดด้อย (Drawbacks)" ของแต่ละ TOR
5. ประเมินคะแนนแต่ละ TOR เต็ม 10 คะแนนใน 5 ด้าน:
   - ระยะเวลา (Duration)
   - ความเชี่ยวชาญของบริษัทหรือทีมงาน (Expertise)
   - ขอบเขต (Scope)
   - เทคนิคที่นำมาใช้ (Technical)
   - ราคา (Price)
   พร้อมระบุเหตุผลประกอบการให้คะแนนอย่างเป็นธรรมและอิงตามข้อเท็จจริงในเอกสาร
6. จัดทำ "ข้อเสนอแนะอื่น ๆ เพื่อประกอบการพิจารณา" ของคณะกรรมการพัสดุ เช่น ประเด็นความเสี่ยง, ความคุ้มค่าตามมาตรา 8 แห่ง พ.ร.บ. จัดซื้อจัดจ้างฯ, PDPA และการบริหารสัญญา`;

    const prompt = `กรุณาวิเคราะห์และเปรียบเทียบเอกสาร TOR ต่อไปนี้อย่างละเอียด และตอบกลับในรูปแบบ JSON ตาม Schema ที่กำหนด:

เอกสารที่ต้องวิเคราะห์:
${docsContext}

${customPrompt ? `ข้อกำหนดเพิ่มเติมจากเจ้าหน้าที่พัสดุ: ${customPrompt}` : ''}

ตอบเป็น JSON โดยมีโครงสร้างดังนี้:
{
  "comparisonTitle": "ชื่อหัวข้อการวิเคราะห์เปรียบเทียบ",
  "commonPoints": ["ความเหมือนข้อที่ 1", "ความเหมือนข้อที่ 2", ...],
  "differences": [
    {
      "dimension": "ชื่อประเด็นเปรียบเทียบ",
      "values": { "torId": "รายละเอียดของ TOR นี้" },
      "procurementNote": "ข้อสังเกตและข้อพิจารณาทางพัสดุ"
    }
  ],
  "evaluations": [
    {
      "torId": "รหัส TOR",
      "scores": {
        "duration": 9.0,
        "expertise": 8.0,
        "scope": 8.5,
        "technical": 9.0,
        "price": 8.5,
        "reasons": {
          "duration": "เหตุผล...",
          "expertise": "เหตุผล...",
          "scope": "เหตุผล...",
          "technical": "เหตุผล...",
          "price": "เหตุผล..."
        }
      },
      "highlights": ["จุดเด่น 1", "จุดเด่น 2"],
      "drawbacks": ["จุดด้อย 1", "จุดด้อย 2"]
    }
  ],
  "procurementRecommendations": [
    {
      "category": "กรณีโครงการ...",
      "suggestedTORId": "รหัส TOR ที่แนะนำ",
      "suggestedTORTitle": "ชื่อ TOR",
      "rationale": "เหตุผลความคุ้มค่าและความเหมาะสมตามระเบียบพัสดุ",
      "riskFactors": ["ความเสี่ยงที่ต้องระวัง 1"],
      "procurementChecklist": ["ข้อตรวจสอบก่อนลงนาม 1"],
      "legalReference": "ข้อกฎหมายหรือระเบียบพัสดุที่เกี่ยวข้อง"
    }
  ],
  "formalReportText": "รายงานสรุปอย่างเป็นทางการ ถึงประธานกรรมการจัดซื้อจัดจ้าง/ตรวจรับพัสดุ..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      parsedData = { rawResponse: rawText };
    }

    res.json({
      success: true,
      analysis: parsedData,
    });
  } catch (error: any) {
    console.error('Error in analyze-tor endpoint:', error);
    res.status(500).json({
      error: error.message || 'เกิดข้อผิดพลาดในการประมวลผลการวิเคราะห์ด้วย AI',
    });
  }
});

// Serve frontend in production or integrate Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
