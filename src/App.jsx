import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/auth-context";
import RequireAuth from "./auth/requires-auth";
import Layout from "@/layout/layout";
import RedirectIfAuthenticated from "./auth/redirect";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Strand from "./pages/strands";
import Examinations from "./pages/examinations";
import Users from "./pages/users";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuthenticated>
                <Register />
              </RedirectIfAuthenticated>
            }
          />

          <Route element={<RequireAuth allowedRoles={["user", "admin"]} />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/strands" element={<Strand />} />
              <Route path="/examinations" element={<Examinations />} />
              <Route path="/users" element={<Users />} />
            </Route>
          </Route>

          {/* for not found */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
