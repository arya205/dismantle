import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import AOS from "aos";
import "aos/dist/aos.css";
import Sidebar from "../components/sidebar";
import Footer from "../components/footer";

const dismantleData = [
  { date: "2025-06-14", count: 8 },
  { date: "2025-06-15", count: 5 },
  { date: "2025-06-16", count: 10 },
  { date: "2025-06-17", count: 12 },
  { date: "2025-06-18", count: 4 },
  { date: "2025-06-14", count: 8 },
  { date: "2025-06-15", count: 5 },
];

export default function Devices() {
  const userName = "Teknisi A";
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    setTimeout(() => {
        AOS.refreshHard(); 
    }, 50);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 mt-12 sm:mt-0">
      <Sidebar />
      <main className="flex-1">
        <header className="hidden sm:flex bg-white shadow px-6 py-4 justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Riwayat Dismantle</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">👷 {userName}</span>
            <a
                href="#"
                class="group relative flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 transition-all duration-200"
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
            </a>
          </div>
        </header>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 font-semibold text-left text-sm">
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Jumlah ONT</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dismantleData.map((item, idx) => (
                  <tr data-aos="fade-up" data-aos-delay={idx * 50} key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{item.date}</td>
                    <td className="px-4 py-3">{item.count}</td>
                    <td className="px-4 py-3">
                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <button
                            onClick={() => setSelectedData(item)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 text-sm rounded cursor-pointer"
                          >
                            Detail
                          </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                          <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
                            <Dialog.Title className="text-lg font-semibold text-gray-800 mb-2">
                              Detail Dismantle - {selectedData?.date}
                            </Dialog.Title>
                            <Dialog.Description className="text-gray-600 mb-4">
                              ONT: 
                              <span className="font-semibold"> {selectedData?.count}</span>
                            </Dialog.Description>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                                    <thead>
                                    <tr className="bg-gray-200 text-sm text-black font-semibold">
                                        <th className="px-5 py-3 text-left">No</th>
                                        <th className="px-5 py-3 text-left">Nama</th>
                                        <th className="px-5 py-3 text-left">Alamat</th>
                                        <th className="px-5 py-3 text-left">Kontak</th>
                                        <th className="px-5 py-3 text-left">Status</th>
                                        <th className="px-5 py-3 text-left">Catatan</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {[1, 2, 3].map((row, idx) => (
                                        <tr
                                        key={idx}
                                        className={`text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                                        >
                                        <td className="px-5 py-3 text-gray-800">{idx + 1}</td>
                                        <td className="px-5 py-3 text-gray-800">nama</td>
                                        <td className="px-5 py-3 text-gray-800">alamat</td>
                                        <td className="px-5 py-3 text-gray-800">kontak</td>
                                        <td className="px-5 py-3">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                            <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                                            done
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-gray-800">note</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end">
                              <Dialog.Close asChild>
                                <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer">
                                  Tutup
                                </button>
                              </Dialog.Close>
                            </div>
                          </Dialog.Content>
                        </Dialog.Portal>
                      </Dialog.Root>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
