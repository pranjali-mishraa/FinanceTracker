import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout       from "./components/layout/Layout";
import Dashboard    from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights     from "./pages/Insights";

export default function App() {
  return (
    // AppProvider wraps everything so every component
    // in the tree can access global state via useAppState()
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Default route → Dashboard */}
            <Route path="/"             element={<Dashboard />}    />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights"     element={<Insights />}     />
            {/* Catch-all → redirect to Dashboard */}
            <Route path="*"             element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}