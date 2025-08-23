# Nillion Secret Vaults UI

A modern, secure dashboard interface for managing Nillion's decentralized private storage system. This application provides a comprehensive UI for interacting with Secret Vaults, enabling users to securely store, query, and manage encrypted data across a decentralized network.

## 🔐 About Nillion Secret Vaults

Nillion Secret Vaults is a decentralized private storage system that allows you to:
- Store sensitive data with end-to-end encryption
- Organize data into collections with granular access controls
- Run secure queries on encrypted data without exposing the underlying information
- Manage user permissions and access rights using decentralized identifiers (DIDs)
- Maintain data privacy across multiple network nodes

## ✨ Features

### Dashboard Overview
- **Real-time Statistics**: View collections, documents, encrypted data volume, and active queries
- **Activity Feed**: Track recent operations and system events
- **Node Status**: Monitor connection status to the Nillion network

### Collections Management
- **Create Collections**: Organize your data with custom encryption settings
- **Browse Collections**: Grid view with encryption status and document counts
- **Collection Metadata**: View creation dates, sizes, and access permissions

### Document Library
- **Upload Documents**: Securely store files with automatic encryption
- **Document Browser**: Search and filter through your encrypted documents
- **Metadata Viewing**: Access document properties, encryption status, and sharing info
- **Secure Sharing**: Grant access to specific users with customizable permissions

### Query System
- **Saved Queries**: Manage and execute queries on your encrypted data
- **Query Builder**: Create new queries targeting specific collections
- **Results Export**: Download query results in various formats
- **Status Tracking**: Monitor query execution with real-time status updates

### Access Control
- **Permission Management**: Grant read, write, or admin access to documents
- **User Management**: Add users by DID (Decentralized Identifier)
- **Access Audit**: View and revoke active permissions
- **Security Logs**: Track all access control changes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Access to a Nillion network (testnet or mainnet)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd nillion-secret-vaults-ui
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   # Nillion Network Configuration
   NEXT_PUBLIC_NILLION_NETWORK_URL=https://testnet.nillion.com
   NEXT_PUBLIC_NILLION_APP_ID=your_app_id
   
   # Optional: Analytics and monitoring
   NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: Light/Dark mode support
- **Font**: DM Sans for modern, technical aesthetic

## 🎨 Design System

The UI follows a security-focused design language:

- **Colors**: Green-based palette conveying trust and security
- **Typography**: DM Sans for clarity and professionalism  
- **Layout**: Clean, spacious design with clear information hierarchy
- **Interactions**: Smooth animations and responsive feedback
- **Accessibility**: WCAG AA compliant with proper contrast ratios

## 📁 Project Structure

\`\`\`
├── app/
│   ├── globals.css          # Global styles and design tokens
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── secret-vaults-dashboard.tsx  # Main dashboard component
│   ├── theme-provider.tsx   # Dark/light theme management
│   └── ui/                  # shadcn/ui components
├── hooks/
│   ├── use-mobile.tsx       # Mobile detection hook
│   └── use-toast.ts         # Toast notification system
├── lib/
│   └── utils.ts             # Utility functions
└── README.md
\`\`\`

## 🔧 Configuration

### Theme Customization
The design system uses CSS custom properties for theming. Modify `app/globals.css` to customize:
- Color palette
- Border radius
- Spacing scale
- Typography settings

### Component Customization
All UI components are built with shadcn/ui and can be customized by modifying the component files in `components/ui/`.

## 🚦 Usage

### Connecting to Nillion Network
1. Ensure your environment variables are properly configured
2. The dashboard will automatically attempt to connect to the specified network
3. Connection status is displayed in the top navigation

### Managing Collections
1. Click "Create Collection" to add a new data collection
2. Configure encryption settings and access permissions
3. Upload documents to your collections via the document library

### Running Queries
1. Navigate to the "Queries" tab
2. Create new queries or run existing saved queries
3. Monitor execution status and download results

### Access Control
1. Go to "Access Control" to manage permissions
2. Add users by their DID (Decentralized Identifier)
3. Set appropriate permission levels (read, write, admin)

## 🔒 Security Considerations

- All data is encrypted before storage on the Nillion network
- User authentication is handled through decentralized identifiers
- Permissions are enforced at the network level
- No sensitive data is stored in browser localStorage
- All API communications use secure protocols

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [Nillion Documentation](https://docs.nillion.com)
- Open an issue in this repository
- Join the [Nillion Discord](https://discord.gg/nillion)

## 🔗 Related Links

- [Nillion Network](https://nillion.com)
- [Nillion Documentation](https://docs.nillion.com)
- [secretvaults-ts Library](https://github.com/NillionNetwork/secretvaults-ts)
- [shadcn/ui Components](https://ui.shadcn.com)
