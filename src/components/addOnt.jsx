import { Plus, Search, Filter, Eye, Pencil, Trash2, MessageCircle, MapPin } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function AddOnt({ onSuccess }) {
    const [open, setOpen] = useState(false);
    const [teknisi, setTeknisi] = useState([]);
    const [nama, setNama] = useState("");
    const [alamat, setAlamat] = useState("");
    const [kontak, setKontak] = useState("+62");
    const [status, setStatus] = useState("");
    const [catatan, setCatatan] = useState("");
    const [tim, setTim] = useState(null);

    useEffect(() => {
        getTeknisi();
    }, []);

    const getTeknisi = async () => {
        try {
        const response = await axios.get(`https://backend-dismantle.vercel.app/teknisi`);
        setTeknisi(response.data);
        } catch (error) {
        console.error("Error fetching teknisi data:", error);
        }
    };

    const handleAddOnt = async (e) => {
        e.preventDefault();

        try {
            await axios.post("https://backend-dismantle.vercel.app/ont", {
                nama_user: nama,
                alamat: alamat,
                telp: kontak,
                status_dismantle: status,
                keterangan: catatan,
                id_user: tim,
            });

            setOpen(false);

            Swal.fire({
                icon: "success",
                title: "ONT berhasil ditambahkan",
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 2000
            });
            if (onSuccess) onSuccess(); 

            setNama("");
            setAlamat("");
            setKontak("+62");
            setStatus("");
            setCatatan("");
            setTim(null);
        } catch (error) {
            console.error("Gagal menambah ONT:", error);
            alert("Gagal menambah ONT");
            setLoading(false);
        }
    };
    return(
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-xl flex items-center gap-1">
                    <Plus size={16} /> Tambah Dismantle
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
                <Dialog.Title className="text-xl font-bold mb-4 text-gray-800">Tambah Dismantle</Dialog.Title>

                <form onSubmit={handleAddOnt} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama</label>
                            <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alamat</label>
                            <input
                            type="text"
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kontak</label>
                            <input
                            type="text"
                            inputMode="numeric"
                            value={kontak}
                            onChange={(e) => setKontak(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            >
                            <option value="">Pilih Status</option>
                            <option value="proses">Proses</option>
                            <option value="selesai">Selesai</option>
                            <option value="hilang">Hilang</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Catatan</label>
                            <input
                            type="text"
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tim</label>
                            <select
                            value={tim}
                            onChange={(e) => setTim(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            >
                            <option value="">Pilih Tim</option>
                            {teknisi.map((item, i) => (
                                <option key={item.id} value={item.id}>
                                {item.name}
                                </option>
                            ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-2">
                    <Dialog.Close asChild>
                        <button
                        type="button"
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                        Batal
                        </button>
                    </Dialog.Close>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
                    >
                        Simpan
                    </button>
                    </div>
                </form>
                </Dialog.Content>
            </Dialog.Portal>
            </Dialog.Root>
    )
}