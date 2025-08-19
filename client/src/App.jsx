import { Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Flex, Spinner } from "@chakra-ui/react";

import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import CourseLayout from "./pages/CourseLayout";
import LessonViewer from "./pages/LessonViewer";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

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

      {/* Course layout with nested lessons */}
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
