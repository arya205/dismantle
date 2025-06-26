import axios from "axios";
import { useState } from "react";

export default function StatusBadgeDropdown ({ currentStatus, id, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState(currentStatus);

  const statusColors = {
    "proses": "bg-yellow-100 text-yellow-800",
    "selesai": "bg-green-100 text-green-800",
    "tidak ketemu": "bg-gray-100 text-gray-800",
    "hilang": "bg-red-100 text-red-700",
  };

  const handleChange = async (newStatus) => {
    setSelected(newStatus);
    setIsEditing(false);

    try {
      await axios.put(`https://backend-dismantle.vercel.app/update-status/${id}`, {
        status_dismantle: newStatus,
      });
      onUpdate();
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  return (
    <div className="relative">
      {!isEditing ? (
        <span
          className={`text-xs px-2 py-1 rounded cursor-pointer ${statusColors[selected] || "bg-gray-100 text-gray-700"}`}
          onClick={() => setIsEditing(true)}
        >
          {selected || "Pilih"}
        </span>
      ) : (
        <select
          autoFocus
          className="text-xs px-2 py-1 rounded border bg-white shadow text-gray-800"
          defaultValue={selected}
          onBlur={() => setIsEditing(false)}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value="proses">Proses</option>
          <option value="selesai">Selesai</option>
          <option value="tidak ketemu">Tidak Ketemu</option>
          <option value="hilang">Hilang</option>
        </select>
      )}
    </div>
  );
};