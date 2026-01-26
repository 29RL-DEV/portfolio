### 🌦️ Weather App

### What this project is

A pure frontend application that consumes a public weather API and displays real-time weather data based on user input.
This project focuses on understanding asynchronous data flow and API integration, not on complex UI or backend logic.

### How it was built (technical flow)
# User interaction
    The user enters a city name into an input field.
    An event listener captures the input and triggers the request flow.

### API request
    The application sends an asynchronous HTTP request using fetch.
    Query parameters are dynamically constructed based on user input.

### Async data handling
    API responses are handled using async/await.
    Errors such as invalid city names or network failures are handled gracefully.

### UI state updates
    The DOM is updated only after successful data retrieval.
    Weather data (temperature, conditions, icons) is rendered dynamically.


### What this project demonstrates

# Understanding of asynchronous JavaScript
# Working with external REST APIs

# Clean separation between:
    data fetching
    UI rendering
# Basic error handling and user feedback

# How to explain it at an interview

“This project helped me understand how frontend applications communicate with external APIs, handle asynchronous data, and update the UI based on real-time responses. I focused on clean logic and predictable UI state changes rather than visual complexity.”

##### 
#### 🤖 AI Dev Agent Demo

### What this project is

An experimental AI-assisted developer tool prototype.
It explores how large language models can support developer reasoning and debugging workflows, not autonomous code execution.


### How it was built (technical flow)
## Structured prompt design
    The system relies on carefully designed prompts to guide analysis.
    Prompts focus on understanding errors, context, and possible fixes.

### Developer-in-the-loop workflow
    The developer provides code snippets, error logs, or test failures.
    The AI responds with analysis, explanations, and suggested solutions.

### Task decomposition
    Problems are broken down into steps:
    analyze the failure
    identify relevant code
    propose fixes
    explain trade-offs

### Output focus
    The AI prioritizes explanations and reasoning over raw code generation.
    Outputs are meant to support decision-making, not replace it.

### What this project demonstrates
    Understanding of LLM strengths and limitations
    Ability to design structured, task-oriented prompts
    System-level thinking about developer tooling
    AI used as an assistant, not an autonomous agent

### How to explain it at an interview

“This is an experimental prototype where I explored how AI can assist developers during debugging. Instead of building an autonomous agent, I focused on structured prompts and analysis-driven workflows, keeping the developer in control.”


####
### 🧩 SaaS Starter Platform

### What this project is

A full-stack SaaS learning project designed to model how real subscription-based products work in practice.
The focus is on authentication, billing, and protected user flows rather than UI-only features.

How it was built (technical flow)
### Frontend
    Built with React.
    Manages authentication state and protected routes.
    Displays dashboards based on subscription status.

### Authentication & database
Supabase handles user authentication and data storage.
Row-level security ensures users can only access their own data.

### Payments
    Stripe is used for subscription management.
    Webhooks handle billing events such as:
    subscription creation
    renewals
    cancellations

### Serverless backend
    Serverless functions process sensitive operations like Stripe webhooks.
    Secrets are never exposed to the frontend.

### What this project demonstrates
    Understanding of real-world SaaS architecture
    Secure authentication and billing integration
    Experience with third-party services
    Awareness of backend security boundaries

### How to explain it at an interview

“I built this project to understand how SaaS products work end-to-end. I implemented authentication, subscription payments with Stripe, and protected routes, focusing on real integration patterns rather than just UI.”

####
### ✅ To-Do Manager App

### What this project is

A full-stack task management application with authentication and user-isolated persistent data.
It focuses on core CRUD functionality and secure frontend-backend integration.

### How it was built (technical flow)

### Authentication
Users must authenticate to access the application.
Authentication state controls access to data and UI.

### Database & data isolation
    Each user has their own set of tasks.
    Backend rules enforce that users can only access their own records.

### CRUD operations
    Create new tasks
    Read task lists
    Update task status
    Delete tasks

### Frontend-backend synchronization
    UI state updates reflect database changes in real time.
    Errors are handled and surfaced to the user.

### What this project demonstrates
    Core CRUD aplication design
    Secure data access patterns
    Frontend-backend communication
    Practical state management tied to persistent storage

### How to explain it at an interview

“This project helped me practice building a complete CRUD application with authentication. Each user has isolated data, and I focused on secure access and clean frontend-backend integration.”