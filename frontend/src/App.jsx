import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import RootLayout from "./layouts/RootLayout";
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import LessonPlans from "./pages/Lesson";
import ClassPage from "./pages/Class";
import ClassProgressReport from "./pages/Feedback";
import Classesroom from "./pages/Classesroom";

const router = createBrowserRouter([
  // Auth routes (without layout)
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  // Protected routes (with RootLayout)
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "classroom",
        element: <Classesroom />
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "lessons",
        element: <LessonPlans />,
      },
      {
        path: "addclass",
        element: <ClassPage />,
      },
      {
        path: "feedback",
        element: <ClassProgressReport />,
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
 