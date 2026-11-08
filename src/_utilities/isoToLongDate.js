export const isoToLongDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  // Cek apakah tanggal valid
  if (isNaN(date.getTime())) return "-";

  // Opsi formatting lengkap dengan nama hari
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return date.toLocaleDateString("id-ID", options);
};
