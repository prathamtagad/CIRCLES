# 🎯 Circles: Privacy-First Social Networking

> "Share what you want, ONLY with who you want."

**Circles** is a privacy-first social networking platform designed to solve the "Privacy Paradox" by allowing you to categorize your connections into distinct trust tiers. It redefines social connection with radical privacy, ensuring you communicate naturally without context collapse.

---

## 🧐 The Problem: The Privacy Paradox

*   **The "All-or-Nothing" Dilemma:** Current platforms force you to share with *everyone* or be completely private.
*   **Context Collapse:** You can't easy separate your professional life, close friends, and acquaintances.
*   **Data Exploitation:** Users have lost control over their own data and digital footprint.

## 💡 The Solution: Circles

We've rebuilt social networking around the natural way humans interact.

*   **Granular Trust Levels:**
    *   🔒 **Inner Circle:** Encrypted, intimate connectivity for your closest friends.
    *   🛡️ **Trusted Circle:** A space for friends and family.
    *   👥 **Extended Circle:** For acquaintances and professional connections.
*   **Context-Aware Sharing:** Choose exactly which circle sees each post.

---

## 🚀 Key Features

*   **📊 Privacy Score:** A dynamic, gamified metric that shows how distinct your digital footprint is.
*   **⚡ Lite Mode:** A sustainability feature that saves bandwidth by hiding media assets on demand.
*   **🗑️ Right to be Forgotten:** One-click "Delete Account" and "Export Data" built into the core.
*   **👁️ Transparency Dashboard:** Real-time stats on data requests.

---

## 🛠️ Technology Stack

Built for speed, security, and scalability.

*   **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/) (Fast HMR)
*   **Styling:** [TailwindCSS](https://tailwindcss.com/) + Custom CSS Variables (Glassmorphism)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Backend:** [Firebase](https://firebase.google.com/) (Authentication & Firestore)

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/circles-app.git
    cd circles-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

This project uses Firebase. You will need to set up your Firebase project and add the configuration.

1.  See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions on setting up Firebase.
2.  Create a `.env` file in the root directory (if not already present/required by the specific setup logic) or ensure your `src/firebase.js` (or equivalent) has the correct config keys.

### Running the App

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 👥 The Team

*   **🏆 Pratham Tagad:** Lead Architect & Full Stack Engineer
*   **🎨 Madhav Maheshwari:** Frontend Specialist & UI/UX Design
*   **🔐 Karan Sachdev:** Backend Engineer & Security Infrastructure

---

*Verified for SGSITS Hackathon 2026*
