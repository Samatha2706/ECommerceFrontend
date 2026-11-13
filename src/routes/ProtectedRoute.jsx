import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ adminOnly = false }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    let isAdmin = false;
    let invalidToken = false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      const role =
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || payload.role;

      isAdmin = role === "Admin";
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      invalidToken = true;
    }

    if (invalidToken) {
      return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;
