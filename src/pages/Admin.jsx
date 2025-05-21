import { Navigate } from "react-router-dom";
import { useAuthContext } from "../services/userProvider";
import Navbar from "../components/NavBar";

export default function Admin() {
  const { user } = useAuthContext();
  if (!user?.isAdmin) return <Navigate to="/" />;

  return (
    <>
      <Navbar />
      <div>
        <h1>Admin Dashboard</h1>
      </div>
    </>
  );
}
