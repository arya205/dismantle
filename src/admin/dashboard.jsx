import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AdminSidebar from "../components/adminSidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../components/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const userName = localStorage.getItem("username") || "Admin";
  const [ontDone, setOntDone] = useState([]);
  const [teknisi, setTeknisi] = useState([]);
  const [ont, setOnt] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.getItem("username") || navigate("/login");
    AOS.init({ duration: 800, once: true });
    getOntDone();
    getAllOnt();
    getTeknisi();
  }, [navigate]);

  const ontLength = ont.length;
  const ontDoneLength = ontDone.length;
  const teknisiLength = teknisi.length; 

  const getAllOnt = async () => {
    try {
      const response = await axios.get("https://backend-dismantle.vercel.app/ont");
      setOnt(response.data);
    } catch (error) {
      console.error("Error fetching all ONT data:", error);
    }
  };

  const getOntDone = async () => {
    try {
      const response = await axios.get("https://backend-dismantle.vercel.app/ont-done");
      setOntDone(response.data);
      console.log("Data ONT:", response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getTeknisi = async () => {
    try {
      const response = await axios.get(`https://backend-dismantle.vercel.app/teknisi`);
      setTeknisi(response.data);
    } catch (error) {
      console.error("Error fetching teknisi data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login")
  };

  const activeMembers = ont.filter((item) => item.status_pd === "CLOSED").length;

  const ontPerMonth = ont.reduce((acc, item) => {
    const date = new Date(item.tanggal);
    const month = date.toLocaleString("default", { month: "short" });
    const existing = acc.find((e) => e.name === month);

    if (existing) {
        existing.total += 1;
    } else {
        acc.push({ name: month, total: 1 });
    }

    return acc;
  }, []);

  const ontDonePerMonth = ontDone.reduce((acc, item) => {
    const date = new Date(item.tanggal);
    const month = date.toLocaleString("default", { month: "short" });
    const existing = acc.find((e) => e.name === month);

    if (existing) {
        existing.total += 1;
    } else {
        acc.push({ name: month, total: 1 });
    }

    return acc;
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 mt-12 sm:mt-0">
        <AdminSidebar />
        <main className="flex-1 flex flex-col">
            <header className="hidden sm:flex bg-white shadow px-6 py-4 justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Beranda Admin</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm">👷 {userName}</span>
                    <button onClick={()=>handleLogout()} className="group relative flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 transition-all duration-200 cursor-pointer">
                    <div className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-r opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-y-100 scale-y-80"></div>
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors duration-200">
                        <svg fill="currentColor" viewBox="0 0 20 20" className="h-5 w-5 text-red-500 group-hover:text-red-600">
                        <path clipRule="evenodd" fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" />
                        </svg>
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-red-600">Logout</span>
                    <svg fill="currentColor" viewBox="0 0 20 20" className="h-3 w-3 text-gray-400 ml-auto group-hover:text-red-500">
                        <path clipRule="evenodd" fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                    </svg>
                    </button>
                </div>
            </header>

            <div className="p-6 flex-1">
                <div className="bg-gray-50 p-6 rounded-3xl shadow-lg max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div data-aos="fade-up" data-aos-delay="100" className="bg-white rounded-xl p-4 flex items-center gap-4 shadow">
                            <div className="bg-green-100 p-2 rounded-full">
                                <span className="text-green-500 text-xl">👥</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Customers</p>
                                <p className="text-2xl font-bold">{ontLength}</p>
                            </div>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="150" className="bg-white rounded-xl p-4 flex items-center gap-4 shadow">
                            <div className="bg-red-100 p-2 rounded-full">
                                <span className="text-green-500 text-xl">⛔</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">ONT Closed</p>
                                <p className="text-2xl font-bold">{activeMembers}</p>
                            </div>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="200" className="bg-white rounded-xl p-4 flex items-center gap-4 shadow">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <span className="text-blue-500 text-xl">📶</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">ONT Diambil</p>
                                <p className="text-2xl font-bold">{ontDoneLength}</p>
                            </div>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="250" className="bg-white rounded-xl p-4 flex items-center gap-4 shadow">
                            <div className="bg-purple-100 p-2 rounded-full">
                                <span className="text-purple-500 text-xl">🧰</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Tim Teknisi</p>
                                <p className="text-2xl font-bold">{teknisiLength}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div data-aos="fade-right" data-aos-delay="300" className="bg-white p-4 rounded-xl shadow">
                            <h3 className="text-lg font-semibold mb-2">Customer Growth</h3>
                            <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={ontPerMonth}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total" fill="#34D399" />
                            </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div data-aos="fade-left" data-aos-delay="350" className="bg-white p-4 rounded-xl shadow">
                            <h3 className="text-lg font-semibold mb-2">Member Activity</h3>
                            <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={ontDonePerMonth}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="total" stroke="#60A5FA" strokeWidth={2} />
                            </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
       </main>
    </div>
  );
}
