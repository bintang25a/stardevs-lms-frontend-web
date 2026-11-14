export const isoToLongDateTime = (dateString, isSec = null) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  // Cek apakah tanggal valid
  if (isNaN(date.getTime())) return "-";

  // Opsi formatting lengkap dengan nama hari
  const options = {
    // weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...(isSec && { second: "2-digit" }),
    hour12: false,
  };

  return date.toLocaleDateString("id-ID", options);
};
