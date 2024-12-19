import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles/globals.css";
import "./i18n";
import { LoadingScreen } from "./components/common/LoadingScreen";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 错误边界处理
const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-white">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
      >
        Reload page
      </button>
    </div>
  </div>
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <React.Suspense fallback={<LoadingScreen />}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.Suspense>
    </QueryClientProvider>
  </React.StrictMode>
);
