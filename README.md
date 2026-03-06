# Chiacon AI Capability Demo

A professional web application that showcases Chiacon's AI capabilities with **two working AI features** powered by Groq's LLaMA 3.3 model.

---

## Features

- **AI capability overview** — Hero section highlighting Chiacon's AI vision
- **3 enterprise AI use cases** — Predictive Sales Forecasting, Customer Support Automation, Document Intelligence
- **AI Opportunity Generator** — Describe a business problem → get a structured analysis with problem summary, AI opportunities, and expected business impact
- **AI Email Generator** — Enter company name, industry, and target role → get a personalized AI-generated outreach email with copy-to-clipboard

## Tech Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Frontend   | HTML, CSS, JavaScript       |
| Backend    | Node.js + Express           |
| AI Model   | Groq API — LLaMA 3.3 70B   |
| Deployment | Replit (or any Node host)   |

## How It Works

### AI Opportunity Generator
1. User enters a business problem (e.g., *"FMCG company struggling with demand forecasting"*)
2. Frontend sends `POST /generate` to the Express backend
3. Backend forwards the problem to **Groq's LLaMA 3.3** with a structured prompt
4. AI returns: **Problem Summary** → **3 AI Opportunities** → **Expected Business Impact**

### AI Email Generator
1. User enters **Company Name**, **Industry**, and **Target Role** (e.g., CFO)
2. Frontend sends `POST /generate-email` to the backend
3. AI generates a personalized outreach email with subject line and body
4. User can **copy** the email to clipboard with one click

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your Groq API key
#    Edit .env and replace your_key_here with your actual key
#    Get a free key at https://console.groq.com

# 3. Start the server
npm start

# 4. Open http://localhost:3000
```

## Project Structure

```
chiacon-ai-demo/
├── server.js          # Express backend + Groq API (/generate, /generate-email)
├── package.json
├── .env               # API key (not committed)
├── public/
│   ├── index.html     # Main page with tab-based demo UI
│   ├── style.css      # Dark-mode premium design
│   └── script.js      # Frontend logic, tab switching, markdown rendering
└── README.md
```

## Environment Variables

| Variable       | Description                                        |
| -------------- | -------------------------------------------------- |
| `GROQ_API_KEY` | Your Groq API key ([get one free](https://console.groq.com)) |

## Deploying on Replit (Step-by-Step)

### Step 1 — Create a Replit Account
Go to [replit.com](https://replit.com) and sign up (free tier works).

### Step 2 — Create a New Repl
1. Click **+ Create Repl**
2. Choose **Import from GitHub**
3. Paste your GitHub repo URL → click **Import from GitHub**
4. Replit will detect it as a Node.js project automatically

### Step 3 — Add Your API Key
1. In the left sidebar, click the **🔒 Secrets** tab (or Tools → Secrets)
2. Add a new secret:
   - **Key:** `GROQ_API_KEY`
   - **Value:** your Groq API key (e.g., `gsk_...`)
3. Click **Add new secret**

### Step 4 — Configure the Run Command
1. Replit usually auto-detects the start script. If not:
2. Create a `.replit` file in the root with this content:
```
run = "npm start"
```

### Step 5 — Click Run
1. Click the green **▶ Run** button at the top
2. Replit will install dependencies and start the server
3. A **Webview** panel will open showing your live site
4. Your public URL will look like: `https://your-repl-name.your-username.repl.co`


Built with ❤️ for the Chiacon AI Prototype Assignment
