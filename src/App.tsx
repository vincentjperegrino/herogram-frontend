import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/Signin";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import MediaManager from "./pages/MediaManager";
import Upload from "./pages/Upload";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/file-manager"
          element={
            <ProtectedRoute>
              <MediaManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
