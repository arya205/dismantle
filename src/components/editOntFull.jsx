import { Plus, Search, Filter, Eye, Pencil, Trash2, MessageCircle, MapPin } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function EditOntFull({ id, onSuccess }) {
    const [open, setOpen] = useState(false);
    const [teknisi, setTeknisi] = useState([]);

    const [snOnt, setSnOnt] = useState("");
    const [noPa, setNoPa] = useState("");
    const [idPelanggan, setIdPelanggan] = useState(null);
    const [idPd, setIdPd] = useState("");
    const [statusPd, setStatusPd] = useState("");
    const [nama, setNama] = useState("");
    const [alamat, setAlamat] = useState("");
    const [kontak, setKontak] = useState("+62");
    const [status, setStatus] = useState("");
    const [catatan, setCatatan] = useState("");

    useEffect(() => {
        getTeknisi();
        getAllOnt();
    }, []);

    const getAllOnt = async () => {
        try {
            const response = await axios.get(`https://backend-dismantle.vercel.app/ont/${id}`);
            setSnOnt(response.data.sn_ont);
            setNoPa(response.data.no_pa);
            setIdPelanggan(response.data.id_pelanggan);
            setIdPd(response.data.id_pd);
            setStatusPd(response.data.status_pd);
            setNama(response.data.nama_user);
            setAlamat(response.data.alamat);
            setKontak(response.data.telp);
            setStatus(response.data.status_dismantle);
            setCatatan(response.data.keterangan);
        } catch (error) {
            console.error("Error fetching all ONT data:", error);
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

    const handleEditOnt = async (e) => {
        e.preventDefault();

        try {
            await axios.patch(`https://backend-dismantle.vercel.app/ont/${id}`, {
                nama_user: nama,
                sn_ont: snOnt,
                no_pa: noPa,
                id_pelanggan: idPelanggan,
                id_pd: idPd,
                status_pd: statusPd,
                alamat: alamat,
                telp: kontak,
                status_dismantle: status,
                keterangan: catatan,
            });
            setOpen(false); 

            Swal.fire({
                icon: "success",
                title: "ONT berhasil diperbarui",
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 2000
            });
            if (onSuccess) onSuccess(); 

            setNama("");
            setSnOnt("");
            setNoPa("");
            setIdPelanggan(null);
            setIdPd("");
            setStatusPd("");
            setAlamat("");
            setKontak("+62");
            setStatus("");
            setCatatan("");
        } catch (error) {
            console.error("Gagal memperbarui ONT:", error);
            alert("Gagal memperbarui ONT");
            setLoading(false);
        }
    };
    return(
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button onClick={(e)=> {
                    e.stopPropagation()
                    }} className="text-yellow-600 hover:text-yellow-800 cursor-pointer">
                    <Pencil size={16} />
                </button>
            </Dialog.Trigger>

            <Dialog.Portal className="transition-opacity duration-300 ease-in-out">
                <Dialog.Overlay
                    className="fixed inset-0 bg-black/50 z-40 data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut"
                    onClick={(e) => {e.stopPropagation();}}
                />

                <Dialog.Content
                    className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-xl max-h-[90vh] overflow-y-auto
                    data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut"
                    onClick={(e) => {e.stopPropagation();}}
                >
                <Dialog.Title className="text-xl font-bold mb-4 text-gray-800">Edit Dismantle</Dialog.Title>

                <form onSubmit={handleEditOnt} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                            <label className="block text-sm font-medium text-gray-700">SN ONT</label>
                            <input
                                type="text"
                                value={snOnt}
                                onChange={(e) => setSnOnt(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            />
                            </div>
                            <div>
                            <label className="block text-sm font-medium text-gray-700">No PA</label>
                            <input
                                type="text"
                                value={noPa}
                                onChange={(e) => setNoPa(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            />
                            </div>
                            <div>
                            <label className="block text-sm font-medium text-gray-700">ID Pelanggan</label>
                            <input
                                type="number"
                                inputMode="numeric"
                                value={idPelanggan}
                                onChange={(e) => setIdPelanggan(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            />
                            </div>
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
                            <label className="block text-sm font-medium text-gray-700">ID PD</label>
                            <input
                                type="text"
                                value={idPd}
                                onChange={(e) => setIdPd(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            />
                            </div>
                            <div>
                            <label className="block text-sm font-medium text-gray-700">Status PD</label>
                            <select
                                value={statusPd}
                                onChange={(e) => setStatusPd(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            >
                                <option value="">Pilih Status</option>
                                <option value="OPEN">OPEN</option>
                                <option value="REQUEST">REQUEST</option>
                                <option value="CLOSED">CLOSED</option>
                            </select>
                            </div>
                        </div>

                        <div className="space-y-4">
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
                            <label className="block text-sm font-medium text-gray-700">Status Dismantle</label>
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