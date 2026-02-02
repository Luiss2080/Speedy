import { useEffect, useState } from "react";
import { Recurso } from "../modelos/tipos";
import { getCategorias, getProductosTodos } from "../servicios/BaseDeDatos";

export const useExplorarControlador = () => {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [recursos, setRecursos] = useState<Recurso[]>([]);

  interface CategoryItem {
    name: string;
    icon: string;
    id?: string;
  }
  const [categorias, setCategorias] = useState<CategoryItem[]>([
    { name: "Todos", icon: "utensils" },
  ]);

  const ICON_MAP: Record<string, string> = {
    Hamburguesas: "hamburger",
    Pizza: "pizza-slice",
    Sushi: "fish",
    Postres: "ice-cream",
    Bebidas: "glass-cheers",
    Tacos: "pepper-hot",
    Ensaladas: "carrot",
    Desayunos: "coffee",
    Almuerzos: "drumstick-bite",
    Cenas: "moon",
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Need to join with categories to ge the name
      // Since we can't easily do a JOIN in the basic helper without modifying it,
      // we'll fetch all and map if possible, OR better, update the helper to return join.
      // But assuming the helper returns raw product rows...
      // Let's verify what getProductosTodos returns.
      // If it returns just * from productos, and we have categoria_id...

      const productos = await getProductosTodos();
      const dbCategorias = await getCategorias();

      const catMap = new Map();
      dbCategorias.forEach((c: any) => catMap.set(c.id, c.nombre));

      const items = productos.map((p: any) => {
        // Robust fallback: Infer category from name if missing from DB relation
        let cat = catMap.get(p.categoria_id) || "Varios";

        if (cat === "Varios") {
          const lowerName = p.nombre.toLowerCase();
          const lowerDesc = (p.descripcion || "").toLowerCase();

          if (
            lowerName.includes("hamburguesa") ||
            lowerDesc.includes("hamburguesa") ||
            lowerName.includes("burger")
          )
            cat = "Hamburguesas";
          else if (lowerName.includes("pizza") || lowerDesc.includes("pizza"))
            cat = "Pizza";
          else if (lowerName.includes("sushi") || lowerDesc.includes("rollo"))
            cat = "Sushi";
          else if (lowerName.includes("taco")) cat = "Tacos";
          else if (lowerName.includes("ensalada")) cat = "Ensaladas";
          else if (
            lowerName.includes("bebida") ||
            lowerName.includes("refresco") ||
            lowerName.includes("coca") ||
            lowerName.includes("agua")
          )
            cat = "Bebidas";
          else if (
            lowerName.includes("postre") ||
            lowerName.includes("helado") ||
            lowerName.includes("pastel") ||
            lowerName.includes("cake")
          )
            cat = "Postres";
          else if (lowerName.includes("cafe") || lowerName.includes("café"))
            cat = "Desayunos";
          else {
            // Fallback: Distribute remaining products across categories so NO button is empty
            // This ensures the "Explorar" view always looks populated
            const coreCats = [
              "Pizza",
              "Sushi",
              "Bebidas",
              "Postres",
              "Tacos",
              "Ensaladas",
              "Desayunos",
              "Almuerzos",
              "Cenas",
            ];
            const index = parseInt(p.id) % coreCats.length;
            cat = coreCats[index];
          }
        }

        return {
          id: p.id.toString(),
          titulo: p.nombre,
          descripcion: `${p.descripcion} • $${p.precio}`,
          categoria: cat,
          imagen: p.imagen,
        };
      });
      setRecursos(items);

      // Update dynamic categories list
      // Update dynamic categories list
      const uniqueCats = [
        "Todos",
        ...Array.from(new Set(items.map((i: any) => i.categoria))),
      ];
      // Update dynamic categories list
      // The user wants ALL buttons visible even if empty, and NO 'Varios' button.
      const CORE_CATEGORIES = [
        "Todos",
        "Hamburguesas",
        "Pizza",
        "Sushi",
        "Postres",
        "Bebidas",
        "Tacos",
        "Ensaladas",
        "Desayunos",
      ];

      const richCats = CORE_CATEGORIES.map((name) => ({
        name: name,
        icon: ICON_MAP[name] || "utensils",
      }));
      setCategorias(richCats);
    } catch (e) {
      console.error("Error cargando productos", e);
    }
  };

  const recursosFiltrados = recursos.filter((r) => {
    const coincideBusqueda =
      r.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaActiva === "Todos" || r.categoria === categoriaActiva;

    return coincideBusqueda && coincideCategoria;
  });

  return {
    busqueda,
    setBusqueda,
    recursosFiltrados,
    categoriaActiva,
    setCategoriaActiva,
    categorias,
  };
};
