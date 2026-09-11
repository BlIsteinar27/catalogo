import { revalidatePath } from "next/cache";

export function revalidateHomeAndDashboard() {
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export function revalidateCategoryAndDashboard() {
  revalidatePath("/dashboard/categorias");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/");
}

export function revalidateCategoryChange() {
  revalidateCategoryAndDashboard();
  revalidatePath("/producto", "layout");
}

export function revalidateProductDetail(id: string) {
  revalidatePath(`/producto/${id}`);
}

export function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/categorias");
  revalidatePath("/dashboard/nuevo");
  revalidatePath("/producto", "layout");
}
