# UIC 918-3 Ticket Barcode Decoder Web App

This is the web-based user interface for the **[uic-918-3](file:///home/francis/github/uic-918-3/README.md)** library. It provides an intuitive, interactive, and visually striking **Neo-Brutalist** web application to parse ticket barcodes and verify their signatures.

The application is built using **Next.js** (App Router), **React**, and **TypeScript**, with **Lucide React** for icons. It enables users to decode barcodes from train tickets conforming to the UIC 918.3 specification (such as Deutsche Bahn tickets) via two input methods:
1. **Hexadecimal String**: Paste the raw hex-encoded payload of the ticket barcode.
2. **Aztec Barcode Image**: Upload an image containing the barcode (PNG, JPG, or JPEG).

---

## Features

- 🛠️ **Dual Input Support**: Decode by pasting raw hex data or uploading barcode images directly.
- 🔑 **Signature Verification**: Verifies the ticket's signature using public keys (e.g. against DB keys in `keys.json`).
- 📦 **Comprehensive Containers**: Supports standard containers like `U_HEAD`, `U_TLAY`, DB-specific `0080BL`, `0080VU`, and WebAssembly-decoded ASN.1 schemas (`U_FLEX`).
- 🎨 **Neo-Brutalist UI**: High-contrast, bold aesthetics with clear success/warning/error states.
- 📋 **Flexible Inspection**:
  - Toggle between human-readable formatted details and raw JSON views for each container.
  - Interactive expand/collapse sections.
  - One-click copy of JSON data to the clipboard.

---

## Project Structure

Inside this `/web` directory:

- **[`app/page.tsx`](file:///home/francis/github/uic-918-3/web/app/page.tsx)**: The main client-side landing page, containing tab selection, drag-and-drop file upload, decoding request trigger, and container presentation layout.
- **[`app/api/decode/route.ts`](file:///home/francis/github/uic-918-3/web/app/api/decode/route.ts)**: API route endpoint (`POST /api/decode`). Cleans hex/image inputs, uses `readBarcode` and `interpretBarcode` from the library, recursively sanitizes binary buffer fields, handles signature verification fallback, and returns JSON.
- **[`app/globals.css`](file:///home/francis/github/uic-918-3/web/app/globals.css)**: Holds global layout wrappers, themes, colors, and the custom Neo-Brutalist CSS classes (like `brutal-card`, `brutal-badge`, etc.).
- **[`app/layout.tsx`](file:///home/francis/github/uic-918-3/web/app/layout.tsx)**: Base HTML wrapper configuring metadata, language (`de`), and main responsive grid containers.
- **[`Dockerfile`](file:///home/francis/github/uic-918-3/web/Dockerfile)**: Multi-stage Docker config which compiles the library, imports PEM files from `certs/`, builds the Next.js standalone application, and hosts it under a non-root user.

---

## Installation & Local Development

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v22 or later recommended)
- **pnpm** (v11 or later)

### 2. Install Workspace Dependencies
From the repository root directory, run:
```bash
pnpm install
```

### 3. Running Development Mode
To run the web app locally from the repository root:
```bash
pnpm --filter web dev
```
Or navigate directly to the `web` folder and start the dev script:
```bash
cd web
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running with Docker (Recommended)

To build and run containerized from the repository root:

```bash
docker compose up -d --build
```

The web application runs on port `3000` inside the container and is exposed at [http://localhost:8089](http://localhost:8089).

---

## Certificate Management

Signature verification relies on keys found in `keys.json`.

If you have custom public key certificates in PEM format:
- Place them in the `certs` folder at the repository root.
- The `Dockerfile` build step automatically runs the `uic918 certificate add` utility to merge certificates into `keys.json` during build time.
