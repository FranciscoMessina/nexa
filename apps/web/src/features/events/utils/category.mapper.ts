type DbCategory =
  | "ropa"
  | "feria_de_emprendedores"
  | "arte_y_cultura"
  | "cine_y_entretenimiento"
  | "deportes"
  | "gastronomia"
  | "musica"
  | "talleres_y_cursos"

const UI_TO_DB: Record<string, DbCategory> = {
  Música: "musica",
  Gastronomía: "gastronomia",
  "Arte y Cultura": "arte_y_cultura",
  Deportes: "deportes",
  "Ferias de Emprendedores": "feria_de_emprendedores",
  "Talleres y Cursos": "talleres_y_cursos",
  "Cine y Entretenimiento": "cine_y_entretenimiento",
  Ropa: "ropa",
}

const DB_TO_UI: Record<DbCategory, string> = {
  musica: "Música",
  gastronomia: "Gastronomía",
  arte_y_cultura: "Arte y Cultura",
  deportes: "Deportes",
  feria_de_emprendedores: "Ferias de Emprendedores",
  talleres_y_cursos: "Talleres y Cursos",
  cine_y_entretenimiento: "Entretenimiento",
  ropa: "Ropa",
}

export function categoryUiToDb(category: string): DbCategory {
  const mapped = UI_TO_DB[category.trim()]

  if (!mapped) {
    throw new Error(`Categoría no válida: ${category}`)
  }

  return mapped
}

export function categoryDbToUi(
  category: DbCategory | null | undefined
): string {
  if (!category) {
    return "Música"
  }

  return DB_TO_UI[category] ?? category
}

export function categoriesUiToDb(categories: Array<string>): Array<DbCategory> {
  return categories.map(categoryUiToDb)
}

export function primaryCategoryDbToUi(
  categories: Array<DbCategory> | null | undefined
): string {
  const first = categories?.[0]
  return categoryDbToUi(first)
}
