
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Forum from "./pages/Forum";

import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("forumUser")
      );

      return savedUser?.id ? savedUser : null;
    } catch {
      return null;
    }
  });

  function handleLogin(userData) {
    if (!userData?.id) {
      throw new Error("Invalid user information.");
    }

    const safeUser = {
      id: userData.id,
      username: userData.username,
    };

    setUser(safeUser);

    localStorage.setItem(
      "forumUser",
      JSON.stringify(safeUser)
    );
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("forumUser");
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={user ? "/forum" : "/login"}
              replace
            />
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/forum" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/forum" replace />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/forum"
          element={
            user ? (
              <Forum
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
