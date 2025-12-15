# 💡 Auraflux-Beacon: AI-Driven Interactive Strategy Research Platform

**Auraflux-Beacon** is the frontend application for **Auraflux-Nexus**, designed to accelerate and structure the strategic research process. It transforms the complex **Interactive Search Process (ISP)** principles into an intuitive, AI-collaborative workspace.

Our vision is to leverage the power of Generative AI to minimize the ambiguity, repetitive steps, and cognitive load associated with traditional research, allowing users to focus purely on **generating actionable insights**.

-----

## 🧭 Core Value and Vision

Auraflux-Beacon acts as a research partner, utilizing Gen AI to achieve two core objectives:

  * **Structured Thinking:** It compels the immediate conversion of unstructured dialogue (Chat) output into **structured, critical research elements** (Question, Scope, Keywords), ensuring a rigorous foundation for the study.
  * **Process Automation:** It guides users efficiently through the entire research cycle via clear phases (Conceptualization, Exploration), providing transparent **flow progression mechanisms**.

-----

## ✨ Features and Highlights

The platform's core experience is built around the **"Dialogue as Data"** philosophy, utilizing an optimized dual-pane workspace.

### 1\. The Dual-Pane Workspace

The interface is divided into two areas to manage interaction and structure:

  * **Dialogue Hub (Chat Interface):** The main interface where users collaborate with the AI. The AI actively guides and optimizes the research direction.
  * **Insight Summary Panel (Structured Output):** A static dashboard that serves as the **Single Source of Truth** for the research foundation. It displays the **Locked Final Research Question**, **Keyword lists**, **Feasibility Assessment**, and **Current Progress**.

### 2\. Research Integrity and Flow Control

We implement strict controls to maintain the integrity and focus of the research:

  * **Question Lock Mechanism:** Critical elements, like the Final Question, can be explicitly **LOCKED** by the user. This prevents the question from being accidentally overwritten by subsequent dialogue or AI suggestions, ensuring research stability.
  * **Non-Intrusive Logging:** Supports an **asynchronous conversion** feature, allowing users to save critical AI responses directly as **Reflection Log drafts** with a single click, without interrupting the current dialogue flow.
  * **Action Bar as Flow Gate:** A dedicated, visually prominent **Action Bar** at the bottom of the workspace is enabled only when all necessary structural conditions are met. This allows the user to perform the final **"Lock & Proceed to Exploration Phase"** action.

-----

## 🏗️ Technical Stack

Auraflux-Beacon is built on a modern, robust, and scalable architecture:

  * **Frontend Framework:** Vue 3 (Composition API)
  * **Language:** TypeScript
  * **Styling:** Tailwind CSS
  * **State Management:** Pinia
  * **Routing:** Vue Router
  * **Build Tool:** Vite

-----

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

  * Node.js (v18.x or higher)
  * npm (or yarn/pnpm)
  * The **Auraflux-Nexus** backend service must be running and accessible via API.

### Installation and Run

```bash
# 1. Clone the repository
git clone https://github.com/solarfresh/Auraflux-Beacon
cd auraflux-beacon

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Run the development server
npm run dev
```

-----

## 🤝 Contributing

We welcome contributions\! Please review our contribution guidelines before submitting pull requests. For major changes or new feature proposals, please open an issue first to discuss the details.

## ⚖️ License

[Apache 2.0](LICENSE)