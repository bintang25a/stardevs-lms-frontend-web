export const isoToSchedule = (dateString, includeSeconds = false) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  // Cek apakah tanggal valid
  if (isNaN(date.getTime())) return "-";

  // Opsi formatting menggunakan toLocaleTimeString untuk menyesuaikan zona waktu lokal
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds && { second: "2-digit" }),
    hour12: false,
  };

  return date.toLocaleTimeString("id-ID", options);
};
