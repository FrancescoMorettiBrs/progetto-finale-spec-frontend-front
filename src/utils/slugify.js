export default function slugify(str = "") {
  return str
    .normalize("NFD") // separa lettere e diacritici
    .replace(/[\u0300-\u036f]/g, "") // rimuove i diacritici (es. ö -> o)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // spazi e simboli -> trattino
    .replace(/^-+|-+$/g, ""); // togli trattini ai bordi
}
