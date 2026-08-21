# PropIntel — Property & Lead Management Intelligence System

A high-performance, production-quality **Property & Lead Management Intelligence Workspace** built with React 18, Vite, React Router v6, React Icons, and LocalStorage database persistence.

---

## 🚀 Quick Start Guide

Follow these steps to run the application on your computer:

### 1. Extract the ZIP
Extract `property-intelligence-system.zip` into a folder on your computer.

### 2. Open Terminal & Navigate to Project
```bash
cd property-intelligence-system
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

The system will start immediately on **`http://localhost:3000`** (or the port displayed in your terminal).

---

## 🌟 Key Architecture & Features

### 1. 6 Primary Pillars
* **Dashboard:** Intelligence center with real-time computed distribution metrics, quick inventory insights, and prioritized Attention Engine recommendations.
* **Properties (`/properties`):** Multi-criteria search, advanced filter matrix (BHK, Micro Market, Type, Transaction, Price/Area), full CRUD, image/floorplan placeholders, and data freshness indicators.
* **Leads (`/leads`):** Buyer & tenant requirement intelligence, budget tracking, matching inventory suggestions, and interactive activity timeline logs.
* **Societies (`/societies`):** Project master records mapped to micro-markets with linked properties count, BHK breakdown, and price ranges.
* **Micro Markets (`/micro-markets`):** Geographic infrastructure corridors and sector clusters linking to societies and properties.
* **Profile & Data Center (`/profile`):** Appearance settings (Light/Dark mode), password management, full JSON/CSV export, backup restore, and factory reset.

### 2. Strict Relational Hierarchy
```
Micro Market (e.g. Golf Course Road)
      ↓
   Society (e.g. DLF The Crest)
      ↓
  Property (e.g. 3 BHK Luxury Apartment)
```
Selecting a Society automatically links the property to the parent Micro Market and Sector.

### 3. System Guidance & Attention Engine
Identifies data quality issues automatically:
* Properties not verified for 30+ / 60+ days
* Active leads without recent updates (7+ days)
* Overdue scheduled follow-ups
* Unlinked societies or missing pricing/owner details

### 4. Spreadsheet Import & Column Detection Wizard
* Supports **CSV** and **Excel (.xlsx)** file uploads.
* 8-step wizard: auto-detects columns, provides visual mapping override, validates required fields, flags duplicates, and imports with summary metrics.

---

## 🎨 Theme & Responsiveness
* **Light & Dark Mode:** Design tokens powered by CSS variables. Theme preference persists in `localStorage`.
* **Desktop:** Sidebar vertical navigation + top header.
* **Tablet:** Collapsible hamburger drawer navigation.
* **Mobile:** Top bar + modern 7-icon bottom navigation with elevated action sheet.

---

## 🛠️ Tech Stack
* **Framework:** React 18 + Vite
* **Routing:** React Router v6
* **Icons:** React Icons (`react-icons/ri`)
* **Parsers:** PapaParse (CSV) & SheetJS (`xlsx`)
* **Styling:** Modular CSS with CSS Variables & Tokens (No Tailwind)
* **Storage:** LocalStorage persistence with JSON initial seed files
