import type { Locale } from "@/i18n/routing";
import { getMessages } from "@/i18n/messages";

type ToolKey = "split" | "qr-code" | "raw2dng";

type ToolSeo = {
  title: string;
  description: string;
  category: string;
  features: string[];
  steps: string[];
  faqs: Array<{ question: string; answer: string }>;
};

const content: Record<ToolKey, ToolSeo> = {
  split: {
    title: "Free image splitter for social media, print, and layouts",
    description: "Split one image into an exact grid of PNG or JPG tiles without uploading it.",
    category: "Image processing",
    features: ["Original, 1:1, 4:3, 16:9, and custom crop ratios", "Adjustable rows and columns from 1 to 50", "PNG or JPG tiles packed into one ZIP file", "Local browser processing with no account or upload"],
    steps: ["Choose an image or drop it into the work area.", "Pick a crop ratio, then adjust the grid rows and columns.", "Move the crop position if the image needs reframing.", "Choose PNG or JPG and download the tile ZIP."],
    faqs: [
      { question: "Does Image Splitter upload my image?", answer: "No. The image is decoded and split locally in your browser. It is not sent to a server." },
      { question: "How many rows and columns can I use?", answer: "You can create between 1 and 50 rows and between 1 and 50 columns." },
      { question: "What files can I export?", answer: "Each tile can be exported as PNG or JPG, and all tiles are downloaded together as a ZIP archive." },
    ],
  },
  "qr-code": {
    title: "Free QR code generator for links, print, and Wi-Fi",
    description: "Create a QR code in your browser and download a crisp SVG or PNG file.",
    category: "Design and print",
    features: ["Links, plain text, Wi-Fi details, and contact information", "SVG export for print and design tools", "PNG export for quick sharing and digital use", "Local generation with no account or data upload"],
    steps: ["Enter a link, text, Wi-Fi credential, or contact detail.", "Choose the error-correction level for your intended use.", "Inspect the generated code in the preview.", "Download an SVG for print or PNG for digital use."],
    faqs: [
      { question: "Is this QR code generator free?", answer: "Yes. You can generate and download QR codes without an account or subscription." },
      { question: "Can I use the QR code for print?", answer: "Yes. SVG is the best choice for print because it stays sharp when resized. PNG is convenient for screens and quick sharing." },
      { question: "Is my QR code content stored?", answer: "No. The QR code is generated locally in your browser and your content is not uploaded." },
    ],
  },
  raw2dng: {
    title: "Free RAW to DNG converter for photographers",
    description: "Convert supported camera RAW files to DNG locally in your browser, without uploading photos.",
    category: "Photography workflow",
    features: ["Sony ARW, Canon CR2/CR3, Nikon NEF, Fujifilm RAF, and more", "Single-file and batch conversion", "Download one DNG or a ZIP archive", "LibRaw and DNG processing runs locally in a Web Worker"],
    steps: ["Wait for the converter runtime to become ready.", "Choose one or more camera RAW files, or drop them into the work area.", "Watch conversion progress in the queue.", "Download each DNG or the complete ZIP when conversion finishes."],
    faqs: [
      { question: "Are my RAW photos uploaded?", answer: "No. Conversion runs locally in your browser. Your camera files stay on your device." },
      { question: "Which RAW formats are supported?", answer: "The converter supports common formats including ARW, CR2, CR3, NEF, RAF, RW2, ORF, and other formats supported by its LibRaw runtime." },
      { question: "Can I convert multiple RAW files?", answer: "Yes. Select multiple files and download the converted DNG files individually or as one ZIP archive." },
    ],
  },
};

const zhHantContent: Record<ToolKey, ToolSeo> = {
  split: {
    title: "圖片分割 — 適合社群、印刷與版面的圖片工具",
    description: "不需上傳圖片，就能將單張圖片精準切成 PNG 或 JPG 網格圖片。",
    category: "圖片處理",
    features: ["支援原始比例、1:1、4:3、16:9 與自訂裁切比例", "列數與欄數可從 1 調整至 50", "將 PNG 或 JPG 圖片打包成單一 ZIP 檔案", "瀏覽器本機處理，不需帳號也不會上傳"],
    steps: ["選擇圖片，或將圖片拖曳到工作區。", "選擇裁切比例，再調整網格列數與欄數。", "如果需要重新構圖，移動裁切位置。", "選擇 PNG 或 JPG，下載切割後的 ZIP 檔案。"],
    faqs: [
      { question: "圖片分割會上傳我的圖片嗎？", answer: "不會。圖片會在瀏覽器本機解碼與切割，不會傳送到伺服器。" },
      { question: "可以設定多少列與欄？", answer: "列數與欄數都可以設定為 1 到 50。" },
      { question: "可以匯出哪些檔案？", answer: "每張圖片可匯出為 PNG 或 JPG，所有圖片會一起下載成 ZIP 壓縮檔。" },
    ],
  },
  "qr-code": {
    title: "適合連結、印刷與 Wi-Fi 的免費 QR Code 產生器",
    description: "直接在瀏覽器建立 QR Code，並下載清晰的 SVG 或 PNG 檔案。",
    category: "設計與印刷",
    features: ["支援連結、純文字、Wi-Fi 資訊與聯絡資料", "SVG 匯出，適合印刷與設計軟體", "PNG 匯出，適合螢幕與快速分享", "本機產生，不需帳號也不會上傳資料"],
    steps: ["輸入連結、文字、Wi-Fi 認證資訊或聯絡資料。", "依照使用情境選擇錯誤修正等級。", "在預覽區檢查產生的 QR Code。", "印刷下載 SVG，數位使用則可下載 PNG。"],
    faqs: [
      { question: "這個 QR Code 產生器免費嗎？", answer: "免費。無需帳號或訂閱就能產生並下載 QR Code。" },
      { question: "QR Code 可以用於印刷嗎？", answer: "可以。SVG 適合印刷，縮放時仍能保持清晰；PNG 則適合螢幕與快速分享。" },
      { question: "我的 QR Code 內容會被儲存嗎？", answer: "不會。QR Code 在瀏覽器本機產生，內容不會上傳。" },
    ],
  },
  raw2dng: {
    title: "給攝影師使用的免費 RAW 轉 DNG 工具",
    description: "在瀏覽器本機將支援的相機 RAW 檔案轉成 DNG，不需上傳照片。",
    category: "攝影工作流程",
    features: ["支援 Sony ARW、Canon CR2／CR3、Nikon NEF、Fujifilm RAF 等格式", "支援單檔與批次轉換", "可下載單一 DNG 或 ZIP 壓縮檔", "LibRaw 與 DNG 處理在 Web Worker 本機執行"],
    steps: ["等待轉換引擎準備完成。", "選擇一個或多個 RAW 檔案，或拖曳到工作區。", "在佇列中查看轉換進度。", "轉換完成後下載個別 DNG，或下載完整 ZIP。"],
    faqs: [
      { question: "我的 RAW 照片會被上傳嗎？", answer: "不會。轉換在瀏覽器本機執行，相機檔案會留在你的裝置上。" },
      { question: "支援哪些 RAW 格式？", answer: "支援 ARW、CR2、CR3、NEF、RAF、RW2、ORF 等常見格式，以及 LibRaw 執行環境支援的其他格式。" },
      { question: "可以一次轉換多個 RAW 檔案嗎？", answer: "可以。選擇多個檔案後，可以個別下載 DNG，或一次下載成 ZIP 壓縮檔。" },
    ],
  },
};

function JsonLd({ tool, data, locale }: { tool: ToolKey; data: ToolSeo; locale: Locale }) {
  const url = `https://tools.wonderstudio.tw/${locale}/${tool === "qr-code" ? "qr-code" : tool}/`;
  const application = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: data.title,
    url,
    description: data.description,
    applicationCategory: data.category,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and a modern browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(application) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} /></>;
}

export function ToolSeoContent({ tool, locale = "en" }: { tool: ToolKey; locale?: Locale }) {
  const data = locale === "zh-Hant" ? zhHantContent[tool] : content[tool];
  const labels = getMessages(locale).seo;
  return <>
    <JsonLd tool={tool} data={data} locale={locale} />
    <article className="tool-seo-content">
      <section className="seo-section seo-lede"><p className="kicker">{data.category.toUpperCase()}</p><h2>{data.title}</h2><p>{data.description} {labels.privacyLede}</p></section>
      <div className="seo-columns">
        <section className="seo-section"><p className="kicker">{labels.whatItDoes}</p><h2>{labels.focused}</h2><ul>{data.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
        <section className="seo-section"><p className="kicker">{labels.howTo}</p><h2>{labels.fourSteps}</h2><ol>{data.steps.map((step) => <li key={step}>{step}</li>)}</ol></section>
      </div>
      <section className="seo-section seo-faq"><p className="kicker">{labels.faq}</p><h2>{labels.questions}</h2><div>{data.faqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
    </article>
  </>;
}
