# 💳 NimbleWallet

NimbleWallet is a modern and secure web application for managing your finances. 📈 With features such as adding funds, peer-to-peer transfers, and transaction tracking, NimbleWallet is designed to provide a seamless user experience. ✨ The app is built with Next.js, Docker, and Express, and utilizes secure test environments for financial transactions.

## 🌟 Features

### 🔐 Authentication

- **Sign Up and Login Options**:
  - 🔧 Email and Password
  - 🔧 Username, Email, and Password
  - 🔧 Google Sign-In

### 💸 Default Balance

- Upon signing in, users receive a default balance 🎯 to explore the app's features.

### 💳 Add Money

- Add funds using:
  - 💳 Credit Cards
  - 💳 Debit Cards
  - 💺 UPI
  - 🏦 Net Banking
- Transactions are handled in test mode ✅ to ensure no actual money is deducted.
- Real-time feedback on transaction status:
  - ✅ Success: The balance is updated via a secure webhook system after a short delay. To enhance security, only the Express.js webhook server communicates directly with the database to update balances.
  - ❌ Failure: An error message is displayed immediately.

### 🤝 Peer-to-Peer Transfers

- Send money to other users 🚀 by providing their email ID.

### 📊 Transaction History

- View a detailed log of recent transactions 📈 in the Transactions section.

### 🔒 Webhook Integration

- 🏦 **Bank webhook (secured and isolated)**: Handles transaction verifications and updates balances securely using Express.js. The frontend and backend in Next.js are decoupled from direct database access for enhanced security.

## 🌍 Demo

Check out the live application at: [NimbleWallet Live](https://wallet-app-navy.vercel.app) 🌟

## 🚀 Installation

### 🔧 Prerequisites

- 🛠️ Docker (for containerized setup)
- 🔧 Node.js and npm (for manual setup)
- 🔧 A web browser

### 🔧 Clone the Repository

```bash
git clone https://github.com/nitinkumarpals/NimbleWallet.git
cd NimbleWallet
```

### 🚧 Run with Docker

1. Build the Docker image:
   ```bash
   docker build -t NimbleWallet .
   ```
2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 NimbleWallet
   ```
3. Open [http://localhost:3000](http://localhost:3000) 🌐 in your browser.

### 🏠 Run Manually

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) 🌐 in your browser.

## 🔧 Technologies Used

- **Frontend**: Next.js (React-based framework) 🔧
- **Backend**: Express.js (for secure webhook handling) 🔒
- **Database**: PostgreSQL 📊
- **ORM**: Prisma 🔄
- **Containerization**: Docker 🚧
- **Hosting**: Vercel 🚀

## 💪 Security

- Transactions are processed in test mode ✅ to ensure safety.
- Webhooks are secured with Express.js 🔒 to prevent unauthorized access.

## 🔧 Contribution

Contributions are welcome! 💖 Please open an issue or submit a pull request on [GitHub](https://github.com/nitinkumarpals/NimbleWallet).

## 🔒 License

This project is licensed under the [MIT License](LICENSE).

## 🌐 Support

If you encounter any issues 🚫 or have questions ❓, feel free to open an issue on the [GitHub repository](https://github.com/nitinkumarpals/NimbleWallet).
