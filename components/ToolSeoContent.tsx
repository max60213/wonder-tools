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

function JsonLd({ tool, data }: { tool: ToolKey; data: ToolSeo }) {
  const url = `https://tools.wonderstudio.tw/${tool === "qr-code" ? "qr-code" : tool}/`;
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

export function ToolSeoContent({ tool }: { tool: ToolKey }) {
  const data = content[tool];
  return <>
    <JsonLd tool={tool} data={data} />
    <article className="tool-seo-content">
      <section className="seo-section seo-lede"><p className="kicker">{data.category.toUpperCase()}</p><h2>{data.title}</h2><p>{data.description} Everything is processed on your device, so you can work with private files without creating an account.</p></section>
      <div className="seo-columns">
        <section className="seo-section"><p className="kicker">WHAT IT DOES</p><h2>Made for a focused workflow.</h2><ul>{data.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
        <section className="seo-section"><p className="kicker">HOW TO USE IT</p><h2>Four simple steps.</h2><ol>{data.steps.map((step) => <li key={step}>{step}</li>)}</ol></section>
      </div>
      <section className="seo-section seo-faq"><p className="kicker">FAQ</p><h2>Common questions.</h2><div>{data.faqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
    </article>
  </>;
}
