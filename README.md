# AI-Enabled Community Health Services Management System (AI-OCHSMS)

A comprehensive healthcare management platform that serves patients, healthcare providers, and administrators with AI-powered features for appointment scheduling, symptom checking, and predictive health analytics.

## 🚀 Features

### Multi-Role User Management
- **Patients**: Access appointments, medical records, AI health assistant
- **Healthcare Providers**: Manage patients, appointments, medical records
- **Administrators**: System analytics, user management, mobile clinic coordination

### AI-Powered Capabilities
- **Intelligent Chatbot**: GPT-4 powered symptom analysis and health guidance
- **Smart Scheduling**: AI-recommended appointment times based on urgency and availability
- **Predictive Analytics**: Disease outbreak detection and health trend analysis

### Core Modules
- **Appointment Management**: Calendar-based booking with real-time availability
- **Electronic Medical Records (EMR)**: Secure, encrypted medical data management
- **Mobile Clinic Services**: Geographic scheduling and resource allocation
- **Emergency Services**: Priority-based emergency request handling
- **Analytics Dashboard**: Comprehensive reporting and insights

## 🛠️ Technology Stack

### Frontend
- **React 18+** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **Zustand** for state management
- **Framer Motion** for animations
- **React Hook Form** for form handling

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** database
- **Redis** for caching
- **JWT** authentication
- **OpenAI GPT-4** integration
- **Socket.io** for real-time features

### DevOps
- **Docker** containerization
- **Docker Compose** for orchestration
- **Nginx** for reverse proxy (production)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │   Express API   │    │   PostgreSQL    │
│                 │◄──►│                 │◄──►│                 │
│   - Dashboard   │    │   - Auth        │    │   - Users       │
│   - Chatbot     │    │   - Medical     │    │   - Records     │
│   - Booking     │    │   - AI Service  │    │   - Logs        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│     Redis       │◄─────────────┘
                         │                 │
                         │   - Sessions    │
                         │   - Cache       │
                         └─────────────────┘
```

## 📦 Installation

### Prerequisites
- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/ai-ochsms.git
   cd ai-ochsms
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Development Setup

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Start development servers**
   ```bash
   npm run dev
   ```

## 🔐 Authentication

### Demo Accounts
Use these credentials to test different user roles:

- **Patient**: `patient@demo.com` / `demo123`
- **Doctor**: `doctor@demo.com` / `demo123`
- **Admin**: `admin@demo.com` / `demo123`

### Security Features
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Password encryption with bcrypt
- Input validation and sanitization
- SQL injection prevention
- CORS and Helmet security headers

## 📊 Database Schema

### Key Entities
- **Users**: Multi-role user accounts
- **Appointments**: Scheduling and booking
- **Medical Records**: Patient health data (encrypted)
- **Chat Conversations**: AI chatbot interactions
- **Mobile Clinics**: Geographic service locations
- **Emergency Requests**: Priority-based emergency handling
- **Audit Logs**: System activity tracking

### Data Security
- Sensitive medical data encryption
- Audit logging for compliance
- GDPR/HIPAA considerations
- Role-based data access

## 🤖 AI Integration

### OpenAI GPT-4 Chatbot
```typescript
// Configure your OpenAI API key
OPENAI_API_KEY=your-api-key-here
```

### Features
- Symptom analysis and assessment
- Condition probability scoring
- Treatment recommendations
- Medical disclaimers and safety checks

### Usage
```javascript
// Example chat interaction
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: "You are a medical AI assistant..." },
    { role: "user", content: "I have a headache and fever..." }
  ]
});
```

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
DB_HOST=your-db-host
DB_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
```

### Docker Production Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with SSL
docker-compose -f docker-compose.prod.yml up -d
```

### Scaling Considerations
- Load balancer configuration
- Database connection pooling
- Redis cluster for session management
- CDN for static assets

## 📝 API Documentation

### Authentication Endpoints
```
POST /api/auth/register  - Register new user
POST /api/auth/login     - User login
POST /api/auth/refresh   - Refresh token
POST /api/auth/logout    - User logout
```

### Medical Records
```
GET    /api/records      - List medical records
POST   /api/records      - Create new record
GET    /api/records/:id  - Get specific record
PUT    /api/records/:id  - Update record
DELETE /api/records/:id  - Delete record
```

### Appointments
```
GET    /api/appointments     - List appointments
POST   /api/appointments     - Create appointment
PUT    /api/appointments/:id - Update appointment
DELETE /api/appointments/:id - Cancel appointment
```

## 🧪 Testing

### Frontend Tests
```bash
cd client
npm test
```

### Backend Tests
```bash
cd server
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

## 🔍 Monitoring

### Health Checks
- API health endpoint: `/api/health`
- Database connectivity
- Redis connection status
- External service availability

### Logging
- Structured logging with Winston
- Request/response logging
- Error tracking
- Audit trail logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- ESLint and Prettier configuration
- TypeScript strict mode
- Conventional commits
- Code review requirements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 integration
- React and Node.js communities
- Healthcare domain experts
- Open source contributors

## 📞 Support

For support and questions:
- 📧 Email: support@ai-ochsms.com
- 📖 Documentation: [Wiki](https://github.com/your-repo/ai-ochsms/wiki)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/ai-ochsms/issues)

---

**Built with ❤️ for better healthcare accessibility**