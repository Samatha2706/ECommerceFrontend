import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../services/profileService";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load your profile.");
      }
    };

    loadProfile();
  }, []);

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p className="profile-error">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>

          <div>
            <h1>My Profile</h1>
            <p>Your ShopEase account details</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <span className="profile-label">Full Name</span>
            <span className="profile-value">{profile.fullName}</span>
          </div>

          <div className="profile-detail">
            <span className="profile-label">Email Address</span>
            <span className="profile-value">{profile.email}</span>
          </div>

          <div className="profile-detail">
            <span className="profile-label">Account Type</span>
            <span className="profile-role">{profile.role}</span>
          </div>
        </div>

        <Link to="/orders" className="profile-orders-button">
          View My Orders
        </Link>
      </div>
    </div>
  );
}

export default Profile;
