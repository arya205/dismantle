import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import AdminSidebar from "../components/adminSidebar";
import { Plus, Search, Filter, Eye, Pencil, Trash2, MessageCircle, MapPin } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import Footer from "../components/footer";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import AddOnt from "../components/addOnt";
import EditOnt from "../components/editOnt";
import EditTeknisi from "../components/editTeknisi";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Teknisi() {
  const userName = localStorage.getItem("username") || "Admin";
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [ont, setOnt] = useState([]);
  const [teknisi, setTeknisi] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState();
  const [username, setUsername] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.getItem("username") || navigate("/login");
    AOS.init({ duration: 800, once: true });
    setTimeout(() => AOS.refreshHard(), 100);
    getTeknisi();
    getAllOnt(); 
  }, [navigate]);

  const refreshOnt = () => {
    selectedTeam ? getOntByTeknisi(selectedTeam.id) : getAllOnt();
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login")
  };

  const getAllOnt = async () => {
    try {
      const response = await axios.get("https://backend-dismantle.vercel.app/ont");
      setOnt(response.data);
    } catch (error) {
      console.error("Error fetching all ONT data:", error);
    }
  };

  const getOntByTeknisi = async (id) => {
    try {
      const response = await axios.get(`https://backend-dismantle.vercel.app/ont-teknisi/${id}`);
      setOnt(response.data);
    } catch (error) {
      console.error("Error fetching ONT data:", error);
    }
  };

  const getTeknisi = async () => {
    try {
      const response = await axios.get(`https://backend-dismantle.vercel.app/teknisi`);
      setTeknisi(response.data);
    } catch (error) {
      console.error("Error fetching teknisi data:", error);
    }
  };

  const addTeknisi = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://backend-dismantle.vercel.app/users", {
        name: name,
        username: username,
        role: "teknisi",
      });
      setOpen(false);
      setName("");
      setUsername("");
      if (response.status === 201) {
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: 'Teknisi berhasil ditambah',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        getTeknisi(); 
      }
    } catch (error) {
      console.error("Error adding teknisi:", error);
      alert("Gagal menambahkan teknisi");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteTeknisi = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: "Data teknisi akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`https://backend-dismantle.vercel.app/users/${id}`);
        if (response.status === 200) {
          Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'success',
            title: 'Teknisi berhasil dihapus',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          getTeknisi(); 
        }
      } catch (error) {
        console.error("Error deleting teknisi:", error);
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'error',
          title: 'Gagal menghapus teknisi',
          showConfirmButton: false,
          timer: 2000
        });
      }
    }
  };

  const handleDeleteOnt = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: "Data ont akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`https://backend-dismantle.vercel.app/ont/${id}`);
        if (response.status === 200) {
          Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'success',
            title: 'Ont berhasil dihapus',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          refreshOnt(); 
        }
      } catch (error) {
        console.error("Error deleting teknisi:", error);
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'error',
          title: 'Gagal menghapus teknisi',
          showConfirmButton: false,
          timer: 2000
        });
      }
    }
  };

  const formatTanggal = (tanggalString) => {
    return dayjs(tanggalString).tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm");
  };

  const handleSelectTeam = (teamId) => {
    const team = teknisi.find((t) => t.id === teamId);
    setSelectedTeam(team);
    getOntByTeknisi(teamId);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOnt = ont.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(ont.length / itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 mt-12 sm:mt-0">
      <AdminSidebar />

      <main className="flex-1 flex flex-col">
        <header className="hidden sm:flex bg-white shadow px-6 py-4 justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Tim Teknisi</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">👷 {userName}</span>
            <button onClick={()=>handleLogout()} className="group relative flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 transition-all duration-200 cursor-pointer">
              <div className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-r opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-y-100 scale-y-80"></div>
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors duration-200">
                <svg fill="currentColor" viewBox="0 0 20 20" className="h-5 w-5 text-red-500 group-hover:text-red-600" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"></path>
                </svg>
              </div>
              <span className="font-medium text-gray-700 group-hover:text-red-600">Logout</span>
              <svg fill="currentColor" viewBox="0 0 20 20" className="h-3 w-3 text-gray-400 ml-auto group-hover:text-red-500" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path>
              </svg>
            </button>
          </div>
        </header>

        <div className="p-6 flex-1">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Daftar Teknisi</h2>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-xl flex items-center gap-1">
                  <Plus size={16} /> Tambah Teknisi
                </button>
              </Dialog.Trigger>

              <Dialog.Portal className="transition-opacity duration-300 ease-in-out">
                <Dialog.Overlay
                  className="fixed inset-0 bg-black/50 z-40 data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut"
                />

                <Dialog.Content
                  className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-xl max-h-[90vh] overflow-y-auto
                  data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut"
                >
                  <Dialog.Title className="text-xl font-bold mb-4 text-gray-800">Tambah Teknisi</Dialog.Title>

                  <form onSubmit={addTeknisi} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Tim</label>
                        <input type="text" value={name} onChange={(e) => {setName(e.target.value)}} className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" value={username} onChange={(e) => {setUsername(e.target.value)}} className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
                      </div>
                    </div>

                    {loading ? (
                      <div className="loader"></div>
                    ) : <div className="flex justify-end pt-4 gap-2">
                          <Dialog.Close asChild>
                            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer">
                              Batal
                            </button>
                          </Dialog.Close>
                          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
                            Simpan
                          </button>
                        </div>
                    }
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          <div data-aos="zoom-out" className="sm:grid sm:grid-cols-3 sm:gap-4 sm:mb-6 flex sm:flex-none overflow-x-auto space-x-4 sm:space-x-0 pb-4 w-full whitespace-nowrap">
            {teknisi.map((item) => (
              <div
                key={item.id}
                className={`relative min-w-[200px] sm:min-w-0 flex-shrink-0 p-4 rounded shadow transition-all duration-300 ${
                  selectedTeam?.id === item.id
                    ? "bg-blue-100 border-blue-500 border"
                    : "bg-white hover:bg-blue-50"
                }`}
              >
                <div onClick={() => {
                  handleSelectTeam(item.id)
                  setCurrentPage(1)
                }} className="cursor-pointer text-center">
                  <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <EditTeknisi id={item.id} onSuccess={getTeknisi}/>
                  <button
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                    onClick={() => handleDeleteTeknisi(item.id)}
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold mb-4">Dismantle oleh {selectedTeam?.name || "semua tim"}</h2>
              <AddOnt onSuccess={refreshOnt}/>
            </div>

            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-200 text-sm text-black font-semibold">
                    <th className="px-5 py-3 text-left">Nama</th>
                    <th className="px-5 py-3 text-left">Alamat</th>
                    <th className="px-5 py-3 text-left">Kontak</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Catatan</th>
                    <th className="px-5 py-3 text-left">Tanggal</th>
                    <th className="px-5 py-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOnt.map((row, idx) => (
                    <tr
                      key={row.id_ont}
                      className={`text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                      data-aos="fade-up"
                      data-aos-delay={idx * 100}
                    >
                      <td className="px-5 py-3 text-gray-800">{row.nama_user || '-'}</td>
                      <td className="px-5 py-3 text-gray-800">{row.alamat || '-'}</td>
                      <td className="px-5 py-3 text-gray-800">{row.telp || '-'}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          row.status_dismantle === "selesai"
                            ? "bg-green-100 text-green-700"
                            : row.status_dismantle === "proses"
                            ? "bg-yellow-100 text-yellow-700"
                            : row.status_dismantle === "hilang"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                          {row.status_dismantle}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-800">{row.keterangan || '-'}</td>
                      <td className="px-5 py-3 text-gray-800">{formatTanggal(row.tanggal) || '-'}</td>
                      <td className="px-5 py-3 text-gray-800">
                        <div className="flex items-center gap-2">
                          <EditOnt id={row.id_ont} onSuccess={refreshOnt}/>
                          <button
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                            onClick={()=> handleDeleteOnt(row.id_ont)}
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center mt-6 gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 rounded-md border text-sm font-semibold transition-all cursor-pointer ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 md:hidden">
              {currentOnt.map((row, idx) => (
                <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} className="bg-white rounded-xl shadow px-4 py-4 relative">
                  <div className="absolute right-3 top-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        row.status_dismantle === "selesai"
                          ? "bg-green-100 text-green-700"
                          : row.status_dismantle === "proses"
                          ? "bg-yellow-100 text-yellow-700"
                          : row.status_dismantle === "hilang"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                      {row.status_dismantle}
                    </span> 
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="font-semibold">{row.nama_user}</div>
                        <div>{row.alamat}</div>
                        <div>{row.kontak}</div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div><br /><br />{row.keterangan}</div>
                        <div>{formatTanggal(row.tanggal) || '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center mt-6 gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 rounded-md border text-sm font-semibold transition-all cursor-pointer ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </div>
  );
}
