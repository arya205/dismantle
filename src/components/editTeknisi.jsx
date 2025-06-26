import { Plus, Search, Filter, Eye, Pencil, Trash2, MessageCircle, MapPin } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function EditTeknisi({ id, onSuccess }) {
    const [name, setName] = useState();
    const [username, setUsername] = useState();
    const [open, setOpen] = useState(false);
    const [teknisi, setTeknisi] = useState([]);

    useEffect(() => {
        getTeknisi();
    }, []);

    const getTeknisi = async () => {
        try {
            const response = await axios.get(`https://backend-dismantle.vercel.app/users/${id}`);
            setName(response.data.name);
            setUsername(response.data.username);
        } catch (error) {
            console.error("Error fetching teknisi data:", error);
        }
    };

    const addTeknisi = async (e) => {
        e.preventDefault();

        try {
        const response = await axios.patch(`https://backend-dismantle.vercel.app/users/${id}`, {
            name: name,
            username: username,
        });
        setOpen(false);
        setName("");
        setUsername("");
        if (response.status === 200) {
            Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'success',
            title: 'Teknisi berhasil diperbarui',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
            });
            if (onSuccess) onSuccess(); 
        }
        } catch (error) {
        console.error("Error edit teknisi:", error);
        alert("Gagal memperbarui teknisi");
        } 
    }

    return(
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
            <button className="text-yellow-600 hover:text-yellow-800 cursor-pointer">
                <Pencil size={16} />
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

                <div className="flex justify-end pt-4 gap-2">
                    <Dialog.Close asChild>
                        <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer">
                            Batal
                        </button>
                    </Dialog.Close>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
                    Simpan
                    </button>
                </div>
                </form>
            </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}