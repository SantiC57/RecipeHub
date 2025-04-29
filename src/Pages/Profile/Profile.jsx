import React, { useState } from 'react';

const Profile = () => {
    const [userInfo, setUserInfo] = useState({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to update user profile
        console.log('Profile updated:', userInfo);
    };

    return (
        <div className="profile-page">
            <h1>Profile Settings</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={userInfo.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={userInfo.password}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default Profile;