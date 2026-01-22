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
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { StatsPage } from '@/pages/StatsPage'
import { VocabPage } from '@/pages/VocabPage'
import { ListeningPage } from '@/pages/ListeningPage'
import { PaperReaderPage } from '@/pages/PaperReaderPage'
import { WriterPage } from '@/pages/WriterPage'
import AchievementsPage from '@/pages/AchievementsPage'
import ResourcesPage from '@/pages/ResourcesPage'
import CommunityPage from '@/pages/CommunityPage'
import SettingsPage from '@/pages/SettingsPage'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "stats",
        element: <StatsPage />,
      },
      {
        path: "vocab",
        element: <VocabPage />,
      },
      {
        path: "listening",
        element: <ListeningPage />,
      },
      {
        path: "papers",
        element: <PaperReaderPage />,
      },
      {
        path: "writer",
        element: <WriterPage />,
      },
      {
        path: "achievements",
        element: <AchievementsPage />,
      },
      {
        path: "resources",
        element: <ResourcesPage />,
      },
      {
        path: "community",
        element: <CommunityPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      }
    ]
  }
]);
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