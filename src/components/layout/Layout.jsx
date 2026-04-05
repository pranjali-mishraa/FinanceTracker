import { useAppState } from "../../context/AppContext";
import Sidebar from "./Sidebar";
import Header  from "./Header";

export default function Layout({ children }) {
  const { darkMode } = useAppState();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="mesh-bg min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Header />
          <main className="flex-1 p-6 md:p-12 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}