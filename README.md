# Alumni Knights' Hub — Vanilla JS Edition
**Developer:** Ignacio
**Institution:** Ateneo de Davao University

## 📌 Project Overview
The **Alumni Knights' Hub** is a centralized web platform designed for the Ateneo de Davao University alumni community. It provides a secure, digital environment for alumni to request academic documents (transcripts, diplomas, certifications), track processing status in real-time, and manage their verified academic profiles.

This version has been refactored from the original Meteor.js/Nuxt framework into **Vanilla JavaScript**, optimized for performance, simplicity, and ease of deployment without external heavy dependencies.

## 🎨 Design Philosophy (Refined)
The interface has been updated to a **Minimalist Flat UI** style:
* **Crisp Typography:** Utilizing the Inter font family for maximum readability.
* **Soft Color Palette:** Deeper blues and clean grays replacing high-contrast gradients for a modern, professional aesthetic.
* **Reduced Clutter:** Intentional removal of non-essential features like complex biometrics and redundant alerts to focus on user task completion.
* **Clean Separation:** Clear distinction between the Alumni (Student) portal and the Staff (Registrar) management view.

## 🛠️ Technical Implementation
Unlike previous iterations, this version uses zero external frameworks:
* **HTML5 & CSS3:** Custom styling using CSS variables for a themeable design system.
* **Vanilla JavaScript:** Modular state management handling UI transitions, modal logic, and views without a virtual DOM.
* **Font Awesome:** Lightweight icon integration for intuitive navigation.

## 🚀 Getting Started
Since this project is built with Vanilla JS, no installation of Node.js or Meteor is required for local viewing.

1.  **Clone/Download** the repository.
2.  Ensure `index.html`, `app.js`, and `aknight-01.png` are in the same directory.
3.  Open `index.html` in any modern web browser.

## 📂 Key Features
### Alumni Portal
* **Dashboard:** Overview of verified records and recent notifications.
* **Document Request:** streamlined multi-step ordering process.
* **Processing Tracker:** Visual stepper and timeline for monitoring registrar progress.
* **Academic Passport:** A verified profile view summarizing degrees and honors.

### Registrar Management (Staff)
* **Operations Dashboard:** High-level stats on pending verifications and today's volume.
* **Document Log:** Searchable database of all historical and active requests.
* **Payment Verification:** Dedicated workflow for confirming GCash/Bank transactions.
* **Status Control:** Ability to move requests through the pipeline (Submitted → Verified → Processed → Ready).

## 🤖 Development Tools
This project utilized prompt-based engineering and AI collaboration (including Google Gemini) to assist in refactoring logic and ensuring the original design intent was preserved during the framework transition.
