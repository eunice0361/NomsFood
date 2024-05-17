import React, { useState } from "react";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    username: "",
    contact: "", // Added contact (phone number) field
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleNewUser = async (profile) => {
    const db = getFirestore();
    try {
      const userCollectionRef = collection(db, "Users");
      await addDoc(userCollectionRef, profile);
      console.log("User profile added to database!");
      alert("You have successfully created this user!");
      setProfile({ email: "", name: "", username: "", contact: "" }); // Reset profile
    } catch (error) {
      console.error("Error adding user", error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await handleNewUser(profile);
      navigate("/home");
      // Reset form handled in try block
    } catch (error) {
      console.error("Error handling user profile:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={profile.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full name"
                value={profile.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={profile.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="contact" className="sr-only">Contact</label>
              <input
                type="tel"
                name="contact"
                id="contact"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Phone number"
                value={profile.contact}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;