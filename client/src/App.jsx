import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import LessonView from "./pages/LessonView";
import AppLayout from "./layouts/AppLayout";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>; // or use LoadingSpinner

  return (
    <Routes>
      {!isAuthenticated ? (
        <Route path="*" element={<LandingPage />} />
      ) : (
        <>
          {/* Wrap dashboard and lessons inside layout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/courses/:courseId/module/:moduleIndex/lesson/:lessonIndex"
              element={<LessonView />}
            />
          </Route>

          {/* Fallback to dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}
