import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { TooltipProvider } from '@/components/ui/tooltip';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { StatsPage } from '@/pages/StatsPage'
import { VocabPage } from '@/pages/VocabPage'
import { ListeningPage } from '@/pages/ListeningPage'
import { PaperReaderPage } from '@/pages/PaperReaderPage'
import { WriterPage } from '@/pages/WriterPage'
import { AchievementsPage } from '@/pages/AchievementsPage'
import { ResourcesPage } from '@/pages/ResourcesPage'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/stats",
    element: <StatsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/vocab",
    element: <VocabPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/listening",
    element: <ListeningPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/papers",
    element: <PaperReaderPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/writer",
    element: <WriterPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/achievements",
    element: <AchievementsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/resources",
    element: <ResourcesPage />,
    errorElement: <RouteErrorBoundary />,
  }
]);
// Basic PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('SW registration failed: ', err);
    });
  });
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
)