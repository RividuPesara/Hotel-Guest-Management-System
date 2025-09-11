import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import type { ChangeEvent } from "react";
import pb from "../lib/pocketbase";
import type { Guest } from "../types/Guest";

export default function GuestList() {
  const location = useLocation();

  // Check if we should show a loading spinner based on navigation state
  const initialShowLoading = location.state?.showLoading || false;

  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(initialShowLoading); // spinner state
  const [error, setError] = useState<string | null>(null); // store any errors

  const [searchTerm, setSearchTerm] = useState(""); // search input
  const [sortBy, setSortBy] = useState<"name" | "email">("name"); // sort preference

  const MIN_LOADING_MS = 1000; // Make sure loading spinner shows at least 1 second

  // Fetch guest list on component mount
  useEffect(() => {
    const fetchGuests = async () => {
      setLoading(true);
      const start = Date.now();

      try {
        // Get all guest records from PocketBase
        const records = await pb.collection("guests").getFullList();
        const data: Guest[] = records.map((r) => ({
          id: r.id,
          first_name: r.first_name || "",
          last_name: r.last_name || "",
          email: r.email || "",
          phone: r.phone || "",
          address: r.address || "",
          date_of_birth: r.date_of_birth || "",
        }));
        setGuests(data); // update state
        setError(null); // clear previous errors
      } catch (err) {
        console.error("PocketBase fetch error:", err);
        setError("Failed to load guests. Check console for details.");
      } finally {
        // Make sure loading spinner is visible for at least MIN_LOADING_MS
        const elapsed = Date.now() - start;
        const remaining = MIN_LOADING_MS - elapsed;
        setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
      }
    };

    fetchGuests();
  }, []);

  // Handlers for search input and sorting
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);
  const clearSearch = () => setSearchTerm("");
  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setSortBy(e.target.value as "name" | "email");

  // Memoized filtered and sorted guest list for performance
  const filteredGuests = useMemo(() => {
    return guests
      .filter((g) => {
        const fullName = `${g.first_name} ${g.last_name}`.toLowerCase();
        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          g.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
          const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
          return nameA.localeCompare(nameB);
        } else {
          return a.email.toLowerCase().localeCompare(b.email.toLowerCase());
        }
      });
  }, [guests, searchTerm, sortBy]);

  // Show loading state
  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">Loading guests...</div>
    );

  // Show error message if fetching failed
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Hotel Guest Management</h1>

      {/* Actions: Add Guest, Search, Sort */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Link
          to="/guests/new"
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Add New Guest
        </Link>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search guests..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
          </select>
        </div>
      </div>

      {/* Guests Table */}
      {filteredGuests.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No guests found.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 font-medium text-gray-700">
                <div className="col-span-2">Name</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Phone</div>
                <div className="col-span-3">Address</div>
                <div className="col-span-1">DOB</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Guest Name */}
                    <div className="col-span-2 font-medium text-gray-900 truncate">
                      {guest.first_name} {guest.last_name}
                    </div>

                    {/* Guest Email */}
                    <div
                      className="col-span-3 text-gray-600 truncate"
                      title={guest.email}
                    >
                      {guest.email}
                    </div>

                    {/* Guest Phone */}
                    <div className="col-span-2 text-gray-600 truncate">
                      {guest.phone || "—"}
                    </div>

                    {/* Guest Address */}
                    <div
                      className="col-span-3 text-gray-600 truncate"
                      title={guest.address}
                    >
                      {guest.address || "—"}
                    </div>

                    {/* Guest Date of Birth */}
                    <div className="col-span-1 text-gray-600 truncate">
                      {guest.date_of_birth
                        ? new Date(guest.date_of_birth)
                            .toISOString()
                            .split("T")[0]
                        : "—"}
                    </div>

                    {/* View Button */}
                    <div className="col-span-1 flex justify-start">
                      <Link
                        to={`/guests/${guest.id}`}
                        state={{ guest }}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors whitespace-nowrap"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
