# Smart Finance Companion

A modern personal finance management application built with React, Vite, and Tailwind CSS.

## Features

- **Dashboard**: Overview of balance, income, and expenses.
- **AI Chatbot**: Financial advice powered by Google Gemini.
- **Calendar View**: Track daily spending with color-coded indicators.
- **Fixed Deposit Calculator**: Plan your investments with ease.
- **Transaction Management**: Search, filter, and manage your expenses.

## Deployment to Vercel

This project is ready to be deployed to Vercel.

### Steps to Deploy

1.  **Push to GitHub**: Push your code to a GitHub repository.
2.  **Import to Vercel**:
    -   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    -   Click **Add New...** -> **Project**.
    -   Import your GitHub repository.
3.  **Configure Environment Variables**:
    -   In the **Environment Variables** section of the Vercel project setup, add:
        -   `GEMINI_API_KEY`: Your Google Gemini API key.
4.  **Deploy**: Click **Deploy**. Vercel will automatically detect the Vite project and build it.

### Client-Side Routing

The `vercel.json` file is included to handle client-side routing (rewrites), ensuring that refreshing the page on any route (like `/calendar`) works correctly.

## Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env` file and add your `GEMINI_API_KEY`.
3.  Start the development server:
    ```bash
    npm run dev
    ```
