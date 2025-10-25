# ExpatOS - AI Memory and Assistant for Global Citizens

> "All Your Important Life Admin—Sorted, Reminded, and Ready—No Matter Where You Call Home."

## 🚀 Overview

ExpatOS is a unified digital command center that empowers global citizens to track, organize, and act on all their most critical admin tasks using AI automation and smart memory features.

## ✨ Key Features

### 🧠 AI-Powered Document Management
- **Centralized Dashboard**: See every deadline (visa/ID/passport, taxes, health insurance, rent) by country
- **AI Memory**: Drop in files, screenshots, links, or copy-pasted info. ExpatOS uses AI-powered tagging and metadata extraction
- **Natural Language Search**: Instantly recall documents with queries like "Show the document I need for my next Emirates ID renewal"

### 🔗 Smart Dependency Mapping
- **AI Dependency Graph**: Automatically maps document relationships (e.g., visa renewal requires valid passport with 6+ months validity)
- **Proactive Alerts**: Get warned about dependency issues before they become problems
- **Document Chain Validation**: AI checks if you CAN legally renew based on all dependencies

### 👨‍👩‍👧‍👦 Family Management
- **Multi-Person Tracking**: Manage spouse + kids' documents in one place
- **Cascading Dependencies**: Family member document dependencies are tracked together
- **Individual Dashboards**: Each family member gets their own document overview

### 🔍 Advanced Search & Organization
- **Semantic Search**: Find documents using natural language queries
- **Smart Tagging**: AI automatically tags documents for easy discovery
- **Timeline View**: Visual timeline of all renewals and deadlines

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL + Authentication + File Storage)
- **ORM**: Prisma for type-safe database operations
- **AI**: OpenAI GPT-4 for document analysis and dependency mapping
- **File Upload**: Uploadthing for secure file handling
- **OCR**: Tesseract.js for document text extraction

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expatos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="your-postgresql-connection-string"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
   
   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"
   
   # Uploadthing
   UPLOADTHING_SECRET="your-uploadthing-secret"
   UPLOADTHING_APP_ID="your-uploadthing-app-id"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
expatos/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── DocumentUpload.tsx
│   │   ├── DocumentSearch.tsx
│   │   ├── DependencyMap.tsx
│   │   └── FamilyManagement.tsx
│   ├── lib/                # Utility functions
│   │   ├── supabase.ts     # Supabase client
│   │   ├── prisma.ts       # Prisma client
│   │   └── utils.ts        # General utilities
│   └── types/              # TypeScript type definitions
├── prisma/
│   └── schema.prisma       # Database schema
└── public/                 # Static assets
```

## 🎯 Core Features Implementation

### Document Upload
- Drag & drop file upload with validation
- Support for PDF, PNG, JPG files
- Automatic OCR text extraction
- AI-powered metadata extraction

### Dependency Mapping
- Real-time analysis of document relationships
- Critical dependency warnings
- Renewal timeline visualization
- Smart alert system

### Natural Language Search
- Semantic search across all documents
- AI-powered relevance scoring
- Context-aware results
- Search history tracking

### Family Management
- Add/edit/delete family members
- Individual document tracking
- Family-wide dependency analysis
- Bulk operations support

## 🔒 Security & Privacy

- **Encryption**: All documents encrypted at rest
- **No External Sharing**: Documents never shared with third parties
- **Secure Storage**: Files stored securely in Supabase
- **Access Control**: User-based document access

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Other Platforms
- **Railway**: Great for full-stack deployment
- **Netlify**: Frontend deployment
- **DigitalOcean**: Custom server setup

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Core document upload and management
- ✅ AI dependency mapping
- ✅ Natural language search
- ✅ Family member management

### Phase 2 (Next)
- 🔄 Authentication system
- 🔄 Real-time notifications
- 🔄 Mobile app (React Native)
- 🔄 Chrome extension

### Phase 3 (Future)
- 📅 Voice-to-memory features
- 📅 AI summary clusters
- 📅 Integration with government portals
- 📅 Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the global expat community
- Inspired by the challenges of managing life admin across borders
- Powered by modern AI and web technologies

## 📞 Support

For support, email support@expatos.com or join our community Discord.

---

**Made with ❤️ for Global Citizens**