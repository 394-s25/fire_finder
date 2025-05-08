import "./App.css";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import { useAuthContext } from "./services/userProvider";
import Home from "./pages/Home";

const App = () => {
  const PrivateRoute = ({ children }) => {
    const { user, authLoading } = useAuthContext();

    if (authLoading) {
      return "Loading...";
    }

    if (!user) {
      return <Navigate to="/sign_up" replace />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
