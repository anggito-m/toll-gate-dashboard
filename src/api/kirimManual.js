import axios from "axios";

/**
 * Mengirim ID truk secara manual ke backend.
 * @param {string} nomorKendaraan - Nomor kendaraan (plat nomor).
 */
export const kirimManual = async (nomorKendaraan) => {
  // Validasi sederhana
  if (!nomorKendaraan || !nomorKendaraan.trim()) {
    throw new Error("Nomor kendaraan tidak boleh kosong.");
  }

  // URL target akan dibentuk berdasarkan 'API_BASE_URL' di atas
  const url = `${
    import.meta.env.VITE_SERVER_ENDPOINT
  }/truck/manual/${nomorKendaraan}`;

  console.log(`Mengirim request ke: ${url}`);
  const response = await axios.post(url);

  // Coba parse JSON dari respons
  const data = response.data;

  // Kembalikan data jika sukses
  console.log("Sukses:", data);
  return data;
};
