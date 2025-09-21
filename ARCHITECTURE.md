# AyurSutra Panchkarma Management System - Architecture

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client (React)"
        UI[User Interface]
        RP[React Pages]
        RC[React Components]
        RS[React State]
        AUTH[Auth Context]
    end

    subgraph "Server (Node.js/Express)"
        API[API Routes]
        MW[Middleware]
        CTR[Controllers]
        NW[Notification Worker]
    end

    subgraph "External Services"
        TW[Twilio WhatsApp]
        DB[(MongoDB)]
    end

    UI --> RP
    RP --> RC
    RC --> RS
    RC --> AUTH
    AUTH --> API
    API --> MW
    MW --> CTR
    CTR --> DB
    NW --> TW
    NW --> DB
```

## User Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Client
    participant Auth
    participant Server
    participant DB

    User->>Client: Enter Credentials
    Client->>Auth: Submit Login/Signup
    Auth->>Server: POST /auth/login or /auth/signup
    Server->>DB: Validate User
    DB-->>Server: User Data
    Server->>Server: Generate JWT
    Server-->>Auth: Return Token + User
    Auth->>Client: Store in localStorage
    Client->>User: Redirect to Dashboard
```

## Practitioner-Patient Management Flow

```mermaid
graph TD
    subgraph "Practitioner Flow"
        P1[Login as Practitioner]
        P2[View Patient List]
        P3[Select Patient]
        P4[View Progress]
        P5[Update Progress/Notes]
        P6[Schedule Sessions]
    end

    subgraph "Patient Flow"
        PT1[Login as Patient]
        PT2[View Own Progress]
        PT3[Submit Feedback]
        PT4[View Sessions]
        PT5[Receive Notifications]
    end

    subgraph "Data Flow"
        D1[(User Collection)]
        D2[(Session Collection)]
        D3[(Notification Collection)]
    end

    P1 --> P2
    P2 --> P3
    P3 --> P4
    P4 --> P5
    P3 --> P6

    PT1 --> PT2
    PT1 --> PT4
    PT4 --> PT3
    PT4 --> PT5

    P5 --> D1
    P6 --> D2
    PT3 --> D2
    D2 --> D3
    D3 --> PT5
```

## Notification System

```mermaid
graph LR
    subgraph "Notification Triggers"
        T1[New Session Scheduled]
        T2[Session Reminder]
        T3[Progress Update]
        T4[Feedback Request]
    end

    subgraph "Notification Worker"
        NW[Notification Worker]
        Q[Queue]
        P[Processor]
    end

    subgraph "Delivery Channels"
        W[WhatsApp]
        I[In-App]
        E[Email]
    end

    T1 & T2 & T3 & T4 --> Q
    Q --> P
    P --> W & I & E
```

## Progress Tracking System

```mermaid
graph TB
    subgraph "Progress Management"
        PM1[Progress Entry]
        PM2[Progress View]
        PM3[Analytics]
    end

    subgraph "Data Points"
        D1[Session Completion]
        D2[Patient Feedback]
        D3[Practitioner Notes]
        D4[Wellness Metrics]
    end

    subgraph "Visualization"
        V1[Progress Charts]
        V2[Recovery Milestones]
        V3[Wellness Trends]
    end

    PM1 --> D1 & D2 & D3 & D4
    D1 & D2 & D3 & D4 --> PM2
    PM2 --> PM3
    PM3 --> V1 & V2 & V3
```

## API Routes Structure

```mermaid
graph LR
    subgraph "Public Routes"
        A[/auth]
        A1[/login]
        A2[/signup]
        A3[/patients]
    end

    subgraph "Protected Routes"
        P[/api]
        P1[/practitioner]
        P2[/sessions]
        P3[/notifications]
        P4[/chat]
    end

    subgraph "Admin Routes"
        AD[/admin]
        AD1[/notifications]
        AD2[/test-whatsapp]
    end

    A --> A1 & A2 & A3
    P --> P1 & P2 & P3 & P4
    AD --> AD1 & AD2
```

## Database Schema Relationships

```mermaid
erDiagram
    User ||--o{ TherapySession : "has"
    User ||--o{ Notification : "receives"
    User ||--o{ Message : "sends/receives"
    User ||--o{ User : "practitioner_assigns"
    TherapySession ||--o{ Feedback : "has"
    TherapySession ||--o{ Progress : "tracks"
    
    User {
        string _id
        string name
        string email
        string password
        string phone
        string userType
        ObjectId assignedPractitioner
        number progress
        string status
        string currentStage
    }

    TherapySession {
        ObjectId _id
        ObjectId patientId
        ObjectId practitionerId
        date date
        string status
        object feedback
        object practitionerNotes
    }

    Notification {
        ObjectId _id
        ObjectId userId
        string type
        string message
        string status
        date createdAt
    }
```

## Core Features and Components

1. **Authentication System**
   - JWT-based auth
   - Role-based access (patient/practitioner)
   - Session management

2. **User Management**
   - Patient profiles
   - Practitioner profiles
   - Patient-Practitioner assignments

3. **Progress Tracking**
   - Session scheduling
   - Progress metrics
   - Feedback collection
   - Visual analytics

4. **Notification System**
   - WhatsApp integration
   - In-app notifications
   - Session reminders
   - Progress updates

5. **UI Components**
   - Progress dashboard
   - Patient selector
   - Session scheduler
   - Notification center
   - Analytics views

## Security Features

```mermaid
graph TB
    subgraph "Security Layers"
        L1[JWT Authentication]
        L2[Role Authorization]
        L3[Route Protection]
        L4[Data Validation]
    end

    subgraph "Protected Resources"
        R1[Patient Data]
        R2[Session Records]
        R3[Progress Metrics]
        R4[Practitioner Notes]
    end

    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> R1 & R2 & R3 & R4
```

## Development Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- External Services: Twilio
- UI: Tailwind CSS
- State Management: React Context
- Authentication: JWT

This architecture document provides a comprehensive overview of the system's components, interactions, and data flows. It serves as a reference for understanding how different parts of the application work together.