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
- **Network Mode Indicator**: Shows whether connected to live testnet or running in demo mode

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

### Wallet Integration
- **Nillion Key Support**: Connect using Nillion seed phrases or private keys
- **Testnet Integration**: Direct connection to Nillion testnet infrastructure
- **Fallback Mode**: Automatic demo mode when testnet APIs are unavailable

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Nillion seed phrase or private key (for testnet connection)

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

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Connecting to Nillion Testnet

1. **Using Seed Phrase**: Enter your 12-word Nillion seed phrase
2. **Using Private Key**: Enter your Nillion private key directly
3. **Demo Mode**: If testnet APIs are unavailable, the app automatically switches to demo mode

## 🌐 Network Configuration

The application automatically configures connections to:

- **Primary API**: `nillion-storage-apis-v0.onrender.com`
- **nilDB Nodes**: Multiple testnet nodes for redundancy
- **Fallback Mode**: Local storage simulation when APIs are unavailable

### Network Status Indicators

- 🟢 **Connected**: Live connection to Nillion testnet
- 🟡 **Demo Mode**: Using local fallback storage
- 🔴 **Disconnected**: No network connection available

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: Light/Dark mode support
- **Font**: DM Sans for modern, technical aesthetic
- **Nillion SDK**: `@nillion/secretvaults` for testnet integration

## 📁 Project Structure

\`\`\`
├── app/
│   ├── globals.css          # Global styles and design tokens
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── secret-vaults-dashboard.tsx  # Main dashboard component
│   ├── wallet-connection.tsx        # Nillion wallet integration
│   ├── network-status.tsx          # Network status indicator
│   ├── error-boundary.tsx          # Error handling component
│   ├── theme-provider.tsx          # Dark/light theme management
│   └── ui/                         # shadcn/ui components
├── hooks/
│   ├── use-nillion.ts       # Nillion SDK integration hook
│   ├── use-mobile.tsx       # Mobile detection hook
│   └── use-toast.ts         # Toast notification system
├── lib/
│   ├── nillion-client.ts    # Nillion API client with fallback
│   ├── nillion-config.ts    # Network configuration
│   ├── error-handler.ts     # Error handling utilities
│   └── utils.ts             # Utility functions
└── README.md
\`\`\`

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env.local` file for additional configuration:

\`\`\`env
# Optional: Custom API endpoints
NEXT_PUBLIC_NILLION_API_URL=https://custom-api.nillion.com

# Optional: Analytics and monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
\`\`\`

### Theme Customization
The design system uses CSS custom properties for theming. Modify `app/globals.css` to customize:
- Color palette
- Border radius
- Spacing scale
- Typography settings

## 🚦 Usage

### Connecting Your Wallet
1. Click "Connect Wallet" on the dashboard
2. Choose connection method (seed phrase or private key)
3. Enter your Nillion credentials
4. The app will attempt to connect to testnet or switch to demo mode

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

## 🔄 Demo Mode vs Live Mode

### Live Mode (Testnet Connected)
- Real operations on Nillion testnet
- Persistent data storage across sessions
- Actual network fees and transaction times
- Full decentralized functionality

### Demo Mode (Fallback)
- Local browser storage simulation
- Instant operations for testing UI
- No network fees or delays
- Data cleared on browser refresh

## 🔒 Security Considerations

- All data is encrypted before storage on the Nillion network
- Private keys are never stored or transmitted
- Seed phrases are processed locally for key derivation
- Permissions are enforced at the network level
- All API communications use secure protocols
- Fallback mode uses secure local storage

## 🐛 Troubleshooting

### Connection Issues
- Verify your seed phrase or private key is correct
- Check network connectivity
- The app will automatically switch to demo mode if APIs are unavailable

### API Errors
- Testnet APIs may be temporarily unavailable
- Demo mode provides full UI functionality for development
- Check the network status indicator for current connection state

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
- [Nillion Testnet](https://testnet.nillion.com)
- [shadcn/ui Components](https://ui.shadcn.com)
