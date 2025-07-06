import { useSelector } from "react-redux";

const SideBar = ({ isOpen, filters, setFilters, activeTab }) => {
  const user = useSelector((state) => state.user.user);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => {
      const updated = { ...prev, [name]: checked };
      if (["casual", "training", "expert"].includes(name)) {
        return {
          ...prev,
          casual: false,
          training: false,
          expert: false,
          [name]: checked,
        };
      }
      return updated;
    });
  };

  return (
    <div
      className={`bg-zinc-900 border-r border-zinc-800 p-6 w-72 min-h-screen fixed top-0 left-0 z-40 transform transition-transform duration-300 md:relative ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      {user && (
        <div className="flex flex-col items-center gap-2 mt-16 md:mt-0">
          <img
            src={user?.profileImage || "https://via.placeholder.com/80"}
            alt="user"
            className="w-20 h-20 rounded-full"
          />
          <h2 className="text-lg font-semibold">{user?.username || "User"}</h2>

          {activeTab === "flights" && (
            <label className="block mt-4 text-sm text-gray-300">
              <input
                type="checkbox"
                name="myFlights"
                checked={filters.myFlights || false}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              My Flights
            </label>
          )}
        </div>
      )}

      {activeTab === "flights" ? (
        <div className="mt-8">
          <h3 className="text-sm text-gray-300 mb-2">Filter Flights</h3>
          <div className="space-y-2 text-sm text-gray-300">
            {[
              "today",
              "morning",
              "evening",
              "casual",
              "training",
              "expert",
            ].map((name) => (
              <label className="block" key={name}>
                <input
                  type="checkbox"
                  name={name}
                  checked={filters[name] || false}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {name.charAt(0).toUpperCase() + name.slice(1)}{" "}
                {["casual", "training", "expert"].includes(name)
                  ? "Server"
                  : ""}
              </label>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-10 px-2 text-sm text-purple-300">
          <h3 className="text-lg font-semibold text-purple-400 mb-2">
            📝 Feed Tips
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Post your best flights with a caption.</li>
            <li>Like and comment on others' memories!</li>
            <li>Share your favorite moments in the sky 🌤️</li>
          </ul>
          <div className="mt-6 text-gray-500 text-xs">
            Infinite Flight Community
            <br />
            Fly. Capture. Share.
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
