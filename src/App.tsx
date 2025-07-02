import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Tasks from "@/pages/Tasks";
import Stats from "@/pages/Stats";
import Settings from "@/pages/Settings";
import { createContext, useState } from "react";
import SideMenu from "@/components/SideMenu";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Routes>
        <Route path="/" element={<Home onMenuOpen={() => setIsMenuOpen(true)} />} />
        <Route path="/tasks" element={<Tasks onMenuOpen={() => setIsMenuOpen(true)} />} />
        <Route path="/stats" element={<Stats onMenuOpen={() => setIsMenuOpen(true)} />} />
        <Route path="/settings" element={<Settings onMenuOpen={() => setIsMenuOpen(true)} />} />
      </Routes>
    </AuthContext.Provider>
  );
}
