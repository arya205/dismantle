import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MessageCircle, MapPin } from "lucide-react";
import Sidebar from "../components/sidebar";
import Footer from "../components/footer";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import StatusBadgeDropdown from "../components/dropDown";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function TechnicianDashboard() {
  const [ont, setOnt] = useState([]);
  const [ontByTeknisi, setOntByTeknisi] = useState([]);
  const [statusCount, setStatusCount] = useState({
    proses: 0,
    selesai: 0,
    tidak_ketemu: 0,
 });
  const userName = localStorage.getItem("name") || "Teknisi"; 
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.getItem("id") || navigate("/");
    AOS.init({ duration: 800, once: true });
    getOntByTeknisi(localStorage.getItem("id") || 1);
  }, [navigate]);

    const getOntByTeknisi = async (id) => {
        try {
            const response = await axios.get(`https://backend-dismantle.vercel.app/ont-teknisi/${id}`);
            const allData = response.data;
            setOntByTeknisi(allData);

            const now = new Date();
            const filtered = allData.filter((item) => {
                const tanggal = new Date(item.tanggal);
                const selisihJam = (now - tanggal) / (1000 * 60 * 60); 
                return selisihJam <= 24;
            });

            
            const statusCounts = {
                proses: 0,
                selesai: 0,
                tidak_ketemu: 0,
            };

            filtered.forEach((item) => {
                const status = item.status_dismantle?.toLowerCase(); 
                if (status === 'proses') statusCounts.proses += 1;
                if (status === 'selesai') statusCounts.selesai += 1;
                if (status === 'hilang') statusCounts.tidak_ketemu += 1;
            });

            setOnt(filtered);
            setStatusCount(statusCounts); 

        } catch (error) {
            console.error("Error fetching ONT data:", error);
        }
    };

    const getTimeAgo = (tanggalString) => {
        const now = dayjs().tz("Asia/Jakarta");
        const waktu = dayjs(tanggalString).tz("Asia/Jakarta");

        const diffMinutes = now.diff(waktu, "minute");
        const diffHours = now.diff(waktu, "hour");
        const diffDays = now.diff(waktu, "day");

        if (diffMinutes < 60) return `${diffMinutes}m lalu`;
        if (diffHours < 24) return `${diffHours}j lalu`;
        return `${diffDays}h lalu`;
    };

  const handleLogout = () => {
    localStorage.removeItem("id");
    navigate("/")
  };

  const handleWhatsApp = (number) => {
    const url = `https://wa.me/${number}`;
    window.open(url, "_blank");
  };

  const handleMap = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(url, "_blank");
  };


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 mt-12 sm:mt-0">
      <Sidebar />

        <main className="flex-1 flex flex-col">
            <header className="hidden sm:flex bg-white shadow px-6 py-4 justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Beranda</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm">👷 {userName}</span>
                    <button
                        onClick={()=> handleLogout()}
                        class="group relative flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                    >
                        <div
                            class="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-r opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-y-100 scale-y-80"
                        ></div>
                        <div
                            class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors duration-200"
                        >
                            <svg
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            class="h-5 w-5 text-red-500 group-hover:text-red-600"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                clip-rule="evenodd"
                                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                fill-rule="evenodd"
                            ></path>
                            </svg>
                        </div>
                        <span class="font-medium text-gray-700 group-hover:text-red-600"
                            >Logout</span>
                        <svg
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            class="h-3 w-3 text-gray-400 ml-auto group-hover:text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            clip-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            fill-rule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </div>
            </header>

            <div className="p-6 flex-1">
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { label: "Proses", value: statusCount.proses, bg: "bg-yellow-100", text: "text-yellow-800" },
                        { label: "Selesai", value: statusCount.selesai, bg: "bg-green-100", text: "text-green-800" },
                        { label: "Hilang", value: statusCount.tidak_ketemu, bg: "bg-red-100", text: "text-red-800" }
                    ].map(({ label, value, bg, text }, idx) => (
                        <div key={idx} className={`${bg} p-4 rounded shadow text-center`} data-aos="zoom-in" data-aos-delay={idx * 100}>
                        <p className={`text-sm font-semibold ${text}`}>{label}</p>
                        <h3 className={`text-2xl font-bold ${text}`}>{value}</h3>
                        </div>
                    ))}
                </div>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Dismantle Terbaru</h2>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-200 text-sm text-black font-semibold">
                                    <th className="px-5 py-3 text-left">No</th>
                                    <th className="px-5 py-3 text-left">Nama</th>
                                    <th className="px-5 py-3 text-left">Alamat</th>
                                    <th className="px-5 py-3 text-left">Kontak</th>
                                    <th className="px-5 py-3 text-left">Status</th>
                                    <th className="px-5 py-3 text-left">Keterangan</th>
                                    <th className="px-5 py-3 text-left">Waktu</th>
                                    <th className="px-5 py-3 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ont.map((item, idx) => (
                                <tr
                                    key={idx}
                                    className={`text-sm ${
                                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-gray-100 transition`}
                                    data-aos="fade-up"
                                    data-aos-delay={idx * 100}
                                >
                                    <td className="px-5 py-3 text-gray-800">{idx + 1}</td>
                                    <td className="px-5 py-3 text-gray-800">{item.nama_user || '-'}</td>
                                    <td className="px-5 py-3 text-gray-800">{item.alamat  || '-'}</td>
                                    <td className="px-5 py-3 text-gray-800">{item.telp || '-'}</td>
                                    <td className="px-5 py-3">
                                        <StatusBadgeDropdown
                                            currentStatus={item.status_dismantle}
                                            id={item.id}
                                            onUpdate={() => getOntByTeknisi(1)}
                                        />
                                        </td>
                                    <td className="px-5 py-3 text-gray-800">{item.keterangan || '-'}</td>
                                    <td className="px-5 py-3 text-gray-800">{getTimeAgo(item.tanggal) || '-'}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-2">
                                            <button
                                            onClick={() => handleWhatsApp(item.telp)}
                                            className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 cursor-pointer"
                                            >
                                            <MessageCircle size={16} />
                                            </button>
                                            <button
                                            onClick={() => handleMap(item.alamat)}
                                            className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 cursor-pointer"
                                            >
                                            <MapPin size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-4 md:hidden">
                    {ont.map((item, idx) => (
                        <div key={idx}  data-aos="fade-up" data-aos-delay={idx * 100} className="bg-white rounded-xl shadow px-4 py-4 relative">
                            <div className="absolute right-3 top-3">
                                <StatusBadgeDropdown
                                    currentStatus={item.status_dismantle}
                                    id={item.id}
                                    onUpdate={() => getOntByTeknisi(1)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="font-semibold">{item.nama_user}</div>
                                        <div>{item.alamat}</div>
                                        <div>{item.telp}</div>
                                    </div>

                                    <div className="space-y-1 text-right">
                                        <div><br /> {item.keterangan}</div>
                                        <div><br /> {getTimeAgo(item.tanggal)}</div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-3">
                                    <button className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                                        <MessageCircle size={16} />
                                    </button>
                                    <button className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200">
                                        <MapPin size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </section>
            </div>
        <Footer />
        </main>
    </div>
  );
}
