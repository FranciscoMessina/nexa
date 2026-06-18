type DbCategory =
  | "ropa"
  | "feria_de_emprendedores"
  | "arte_y_cultura"
  | "cine_y_entretenimiento"
  | "deportes"
  | "gastronomia"
  | "musica"
  | "talleres_y_cursos"

export function eventIncludesFeriaCategory(
  categories: Array<DbCategory> | null | undefined
): boolean {
  return categories?.includes("feria_de_emprendedores") ?? false
}
