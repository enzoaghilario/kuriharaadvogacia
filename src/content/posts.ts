// Publicações aprovadas pelo escritório. Nenhum conteúdo fictício.
export type Post = {
  slug: string;
  title: string;
  category: string;
  date: string; // AAAA-MM-DD
  summary: string;
  body: string[]; // parágrafos
};
export const POSTS: Post[] = [];

export function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
