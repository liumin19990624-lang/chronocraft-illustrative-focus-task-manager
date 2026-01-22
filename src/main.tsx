import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LoadingScreen } from '@/components/ui/loading-screen';
import '@/index.css'
// Lazy Loading Pages
const AppLayout = lazy(() => import('@/components/layout/AppLayout').then(m => ({ default: m.AppLayout })));
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const StatsPage = lazy(() => import('@/pages/StatsPage').then(m => ({ default: m.StatsPage })));
const VocabPage = lazy(() => import('@/pages/VocabPage').then(m => ({ default: m.VocabPage })));
const ListeningPage = lazy(() => import('@/pages/ListeningPage').then(m => ({ default: m.ListeningPage })));
const PaperReaderPage = lazy(() => import('@/pages/PaperReaderPage').then(m => ({ default: m.PaperReaderPage })));
const WriterPage = lazy(() => import('@/pages/WriterPage').then(m => ({ default: m.WriterPage })));
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage'));
const CheckinPage = lazy(() => import('@/pages/CheckinPage').then(m => ({ default: m.CheckinPage })));
const ResourcesPage = lazy(() => import('@/pages/ResourcesPage'));
const CommunityPage = lazy(() => import('@/pages/CommunityPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <AppLayout />
      </Suspense>
    ),
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
        path: "checkin",
        element: <CheckinPage />,
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