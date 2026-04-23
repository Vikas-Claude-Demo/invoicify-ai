# Invoicify.ai 📄🚀

**Invoicify.ai** is a high-performance, AI-driven invoice processing application that automates data extraction from financial documents with extreme precision. Built with React and powered by Google's Gemini 1.5 Pro, it transforms unstructured invoices into structured, actionable data in seconds.

![Invoicify Banner](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2670&auto=format&fit=crop)

## ✨ Features

- 🧠 **AI-Powered Extraction**: Uses Gemini 1.5 to extract vendors, dates, amounts, and complex line items.
- 📂 **Multi-Format Support**: Seamlessly process PDFs and high-resolution images (PNG, JPEG, WebP).
- 📊 **Structured Data**: Automatically generates JSON structures and tabular line-item views.
- 📝 **Smart Summaries**: Get a human-readable AI summary of the invoice's purpose and key details.
- 📥 **Export Options**: One-click export to **CSV** and **JSON** for easy integration with accounting software.
- 🔒 **Privacy Focused**: Documents are processed in real-time. No long-term storage of your sensitive financial data.
- ⚡ **Lightning Fast**: Built on Vite for a sub-second development experience and rapid production performance.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **AI Engine**: [Google Gemini 1.5 Pro/Flash](https://ai.google.dev/)
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google AI (Gemini) API Key. Get one at [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/invoicify-ai.git
   cd invoicify-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   APP_URL="http://localhost:3000"
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 📖 Usage

1. **Upload**: Drag and drop an invoice (PDF or Image) into the upload zone.
2. **Analyze**: Click "Process Invoice" to start the AI extraction.
3. **Review**:
   - **Summary View**: Quick look at the vendor, total, and AI-generated analysis.
   - **JSON Structure**: View the raw structured data extracted.
   - **Raw Text**: See the OCR text extracted from the document.
4. **Export**: Use the "Save JSON" or "Export CSV" buttons to download your data.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Developer
Developed with ❤️ by [Dr. Dhaval Trivedi](https://drdhaval.in)

🔗 **GitHub Profile:** [drdhavaltrivedi](https://github.com/drdhavaltrivedi)

## 📄 License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.

---

Built with ❤️ by the Brilworks Team.
