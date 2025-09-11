import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import pb from "../lib/pocketbase";
import type { Guest } from "../types/Guest";

export default function GuestDetail() {
  // Get the guest ID from the URL params
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // If the guest was passed by navigation state, use it to avoid any refetching
  const initialGuest = location.state?.guest as Guest | undefined;

  const [guest, setGuest] = useState<Guest | null>(initialGuest || null);
  const [loading, setLoading] = useState(!initialGuest); // show loading if we don't have guest yet
  const [updating, setUpdating] = useState(false); // track if an update is in progress
  const [error, setError] = useState<string | null>(null); // store any error messages

  const MIN_LOADING_MS = 1000; // making sure the loading screen is shown for 1 second

  useEffect(() => {
    if (guest) return; // if we already have guest data, no need to fetch

    if (!id) {
      setError("No guest ID provided");
      setLoading(false);
      return;
    }

    const fetchGuest = async () => {
      setLoading(true);
      const start = Date.now();

      try {
        // Fetch guest from PocketBase using the ID
        const record = await pb.collection("guests").getOne(id);

        // Map fetched record to our Guest type
        setGuest({
          id: record.id,
          first_name: record.first_name || "",
          last_name: record.last_name || "",
          email: record.email || "",
          phone: record.phone || "",
          address: record.address || "",
          date_of_birth: record.date_of_birth || "",
        });

        setError(null); // clear any previous errors
      } catch (err: any) {
        console.error("Failed to fetch guest:", err);
        setError(
          err.status === 404
            ? "Guest not found"
            : "Failed to load guest details"
        );
      } finally {
        // Make sure its shown for at least MIN_LOADING_MS
        const elapsed = Date.now() - start;
        const remaining = MIN_LOADING_MS - elapsed;
        setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
      }
    };

    fetchGuest();
  }, [id, guest]);

  // Update guest state as user types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!guest) return;
    setGuest({ ...guest, [e.target.name]: e.target.value });
  };

  // Update guest in PocketBase
  const handleUpdate = async () => {
    if (!guest) return;

    if (
      !guest.first_name.trim() ||
      !guest.last_name.trim() ||
      !guest.email.trim()
    ) {
      setError("First name, last name, and email are required.");
      return;
    }

    setUpdating(true);
    setError(null);

    const start = Date.now();

    try {
      await pb.collection("guests").update(guest.id, {
        first_name: guest.first_name.trim(),
        last_name: guest.last_name.trim(),
        email: guest.email.trim(),
        phone: guest.phone?.trim() || "",
        address: guest.address?.trim() || "",
        date_of_birth: guest.date_of_birth || null,
      });

      alert("Guest updated successfully!");
      navigate("/guests", { state: { showLoading: true } });
    } catch (err: any) {
      console.error("Failed to update guest:", err);
      setError(
        err.response?.data?.email
          ? "Email is already in use"
          : "Failed to update guest"
      );
    } finally {
      // Make sure the update shows for at least MIN_LOADING_MS
      const elapsed = Date.now() - start;
      const remaining = MIN_LOADING_MS - elapsed;
      setTimeout(() => setUpdating(false), remaining > 0 ? remaining : 0);
    }
  };

  // Delete guest from PocketBase
  const handleDelete = async () => {
    if (!guest) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${guest.first_name} ${guest.last_name}?`
      )
    )
      return;

    try {
      await pb.collection("guests").delete(guest.id);
      alert("Guest deleted successfully!");
      navigate("/guests", { state: { showLoading: true } });
    } catch (err: any) {
      console.error("Failed to delete guest:", err);
      setError("Failed to delete guest. Please try again.");
    }
  };

  // Show loading screen while fetching or updating
  if (loading || updating) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <p className="text-gray-500">
          {loading ? "Loading guest details..." : "Updating guest..."}
        </p>
      </div>
    );
  }

  // Show error if guest not found
  if (!guest) {
    return (
      <div className="p-6 max-w-md mx-auto text-center text-gray-500">
        <p>{error || "Guest not found"}</p>
        <button
          onClick={() => navigate("/guests")}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back
        </button>
      </div>
    );
  }

  // Main guest detail form
  return (
    <div className="p-6 bg-white shadow rounded max-w-md mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4">Guest Details</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* First Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            name="first_name"
            value={guest.first_name}
            onChange={handleChange}
            disabled={updating}
            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Last Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            name="last_name"
            value={guest.last_name}
            onChange={handleChange}
            disabled={updating}
            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={guest.email}
            onChange={handleChange}
            disabled={updating}
            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Phone Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={guest.phone || ""}
            onChange={handleChange}
            disabled={updating}
            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Address Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            name="address"
            value={guest.address || ""}
            onChange={handleChange}
            disabled={updating}
            rows={3}
            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date of Birth Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={guest.date_of_birth || ""}
            onChange={handleChange}
            disabled={updating}
            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          disabled={updating}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
        >
          Delete
        </button>
        <button
          onClick={() => navigate("/guests", { state: { showLoading: true } })}
          disabled={updating}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
        >
          Back
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-4">* Required fields</p>
    </div>
  );
}
