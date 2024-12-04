import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const navigation = [
  { name: "File Manager", href: "/file-manager" },
  { name: "Upload", href: "/upload" },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Determine the header title based on the current path
  const currentNav = navigation.find((item) => item.href === location.pathname);
  const headerTitle = currentNav ? currentNav.name : "Dashboard";

  return (
    <div className="flex h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Header title={headerTitle} />
        <main className="flex-grow bg-gray-100 p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;