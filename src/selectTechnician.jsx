import React from "react";
import Footer from "./components/footer";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SelectTechnician() {
    const [teknisi, setTeknisi] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getTeknisi();
    }, []);

    const handleNavigate = (id, name) => {
      const expiredAt = new Date().getTime() + 6 * 60 * 60 * 1000;
      localStorage.setItem("id", id);
      localStorage.setItem("name", name);
      localStorage.setItem("id_expired", expiredAt.toString());
      navigate(`/dashboard`);
    }

    const getTeknisi = async () => {
    try {
      const response = await axios.get(`https://backend-dismantle.vercel.app/teknisi`);
      setTeknisi(response.data);
    } catch (error) {
      console.error("Error fetching teknisi data:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Teknisi</h1>
        <p className="text-gray-500">Halaman monitoring teknisi dismantle</p>
      </header>

      <div className="flex flex-wrap justify-center gap-6">
        {teknisi?.map((tech, index) => (
            <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-5 w-[250px] hover:shadow-xl transition duration-300 transition duration-500 hover:scale-100 cursor-pointer"
                onClick={() => {handleNavigate(tech.id, tech.name)}}
            >
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-800">{tech.name}</h2>
                    <h2 className="text-sm text-gray-800">{tech.username}</h2>
                </div>
            </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}