import { useState } from "react";
import { useNavigate } from "react-router-dom";
import pb from "../lib/pocketbase";

export default function AddGuest() {
  const navigate = useNavigate();

  // Error state to show validation or API errors
  const [error, setError] = useState<string | null>(null);

  // Loading state to disable inputs and show progress
  const [loading, setLoading] = useState(false);

  // Guest form data state
  const [guestData, setGuestData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
  });

  // Update guestData state when input fields change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setGuestData({ ...guestData, [e.target.name]: e.target.value });
  };

  // Handle form submission to create a new guest
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic required fields validation
    if (
      !guestData.first_name.trim() ||
      !guestData.last_name.trim() ||
      !guestData.email.trim()
    ) {
      setError("First name, last name, and email are required.");
      setLoading(false);
      return;
    }

    try {
      // Call PocketBase API to create new guest
      await pb.collection("guests").create({
        first_name: guestData.first_name.trim(),
        last_name: guestData.last_name.trim(),
        email: guestData.email.trim(),
        phone: guestData.phone.trim(),
        address: guestData.address.trim(),
        date_of_birth: guestData.date_of_birth || null,
      });

      alert("Guest added successfully!");
      navigate("/guests"); // Redirect to guest list
    } catch (err: any) {
      console.error("Failed to create guest:", err);

      // Handle specific API errors (e.g., duplicate email)
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.email) {
          setError("Email is already in use or invalid.");
        } else {
          setError(
            "Failed to add guest. Please check your input and try again."
          );
        }
      } else {
        setError(
          "Failed to add guest. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false); // stop loading spinner
    }
  };

  // Handle cancel button click, with confirmation
  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      navigate("/guests"); // Go back to guest list
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Guest</h2>

      {/* Display error messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Guest form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name *
          </label>
          <input
            id="first_name"
            name="first_name"
            value={guestData.first_name}
            onChange={handleChange}
            placeholder="Enter first name"
            required
            disabled={loading}
            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name *
          </label>
          <input
            id="last_name"
            name="last_name"
            value={guestData.last_name}
            onChange={handleChange}
            placeholder="Enter last name"
            required
            disabled={loading}
            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email *
          </label>
          <input
            id="email"
            name="email"
            value={guestData.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter email address"
            required
            disabled={loading}
            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            value={guestData.phone}
            onChange={handleChange}
            type="tel"
            placeholder="Enter phone number"
            disabled={loading}
            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={guestData.address}
            onChange={handleChange}
            placeholder="Enter address"
            rows={3}
            disabled={loading}
            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label
            htmlFor="date_of_birth"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date of Birth
          </label>
          <input
            id="date_of_birth"
            name="date_of_birth"
            value={guestData.date_of_birth}
            onChange={handleChange}
            type="date"
            disabled={loading}
            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex space-x-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Guest"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>

      <p className="text-sm text-gray-500 mt-4">* Required fields</p>
    </div>
  );
}
