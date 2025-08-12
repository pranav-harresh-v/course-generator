import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import CourseLayout from "./pages/CourseLayout";
import LessonViewer from "./pages/LessonViewer";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  // Wait until Auth0 finishes loading before deciding what to show
  if (isLoading) return null;

  return (
    <Routes>
      {/* Root path: Landing if logged out, Dashboard if logged in */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          ) : (
            <LandingPage />
          )
        }
      />

      {/* Direct dashboard route (optional) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Course + lesson routes */}
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
