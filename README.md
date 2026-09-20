# 🚀 DiffPulse: IaC Drift & Cost Predictor

> **Built for the AWS "Zero to Shipped" Hackathon (Workplace Efficiency & Community Track)**

DiffPulse is a 100% free, serverless infrastructure safety net designed to protect students, indie builders, and local developers from accidental cloud billing catastrophes before deploying code to AWS.

---

## 🏗️ System Architecture

DiffPulse is built on a high-performance, zero-maintenance serverless stack:

```
[ Developer / Student ]
│ (Pastes YAML/JSON Blueprint)
▼
[ AWS Amplify (React UI Frontend) ]
│ (HTTP POST with JSON Body)
▼
[ Amazon API Gateway (HTTP API Route) ]
│ (Invokes Lambda Function)
▼
[ AWS Lambda (Node.js 20.x Parser Engine) ]
├── Regular Expression Engine (Scans for Resource Types)
├── Cost Risk Matrix (Calculates Score 0-100)
└── Recommendation Generator (Free-Tier Optimization)
│ (Returns JSON Payload)
▼
[ React UI Dashboard (Renders Risk Score & Recommendations) ]
```

---

## ✨ Key Features
- **Dynamic Resource Scanning:** Automatically parses raw CloudFormation/Terraform YAML or JSON for expensive resources like NAT Gateways, EKS Clusters, Redshift, and Multi-AZ RDS.
- **Instant Risk Scoring:** Computes a custom risk score from `0/100` (safe) to `100/100` (high billing risk).
- **1-Click Sample Testing:** Includes built-in templates to instantly test safe serverless setups vs. costly enterprise architectures.
- **100% Free Tier Stack:** Built entirely using free-tier AWS components (Lambda, API Gateway, and Amplify).

---

## 🚀 Live Demo
Access the live production deployment hosted on AWS Amplify:
👉 **[https://main.d2xjlce6xbutvx.amplifyapp.com](https://main.d2xjlce6xbutvx.amplifyapp.com)**

---

## 🛠️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jeetlohe/diffpulse.git
   cd diffpulse/diffpulse-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run locally:**
   ```bash
   npm run dev
   ```
