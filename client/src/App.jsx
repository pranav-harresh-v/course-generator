import { Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CourseLayout from "./pages/CourseLayout";
import LessonViewer from "./pages/LessonViewer";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Root route changes based on login state */}
      <Route
        path="/"
        element={isAuthenticated ? <DashboardPage /> : <LandingPage />}
      />

      {/* Protected course routes */}
      <Route
        path="/courses/:courseId"
        element={
          <ProtectedRoute>
            <CourseLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="module/:moduleIndex/lesson/:lessonIndex"
          element={<LessonViewer />}
        />
      </Route>
    </Routes>
  );
}
