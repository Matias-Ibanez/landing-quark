import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageGallery } from "../src/app/chat/_components/image-gallery";
import type { Job } from "../src/app/chat/_components/api";

it("filters by media type, searches content and opens the chosen preview", async () => {
  const image: Job = { id: "image", project_id: "a", kind: "render", status: "done", error: null, created_at: "", payload: { revision: 1, kind: "png", quality: "final", document: { caption: "Café de especialidad", engine: "hermes" } }, result: { url: "/media/exports/cafe.svg", vectorUrl: "/media/exports/cafe.svg" } };
  const video: Job = { ...image, id: "video", project_id: "b", payload: { ...image.payload, kind: "mp4" }, result: { url: "/media/exports/video.mp4" } };
  const open = vi.fn();
  render(<ImageGallery jobs={[image, video]} projects={[{ id: "a", name: "Promoción", revision: 1, updated_at: "" }, { id: "b", name: "Historia", revision: 1, updated_at: "" }]} onResume={vi.fn()} onPlan={vi.fn()} onPreview={open} />);
  await userEvent.click(screen.getByRole("button", { name: "Videos" }));
  expect(screen.queryByRole("button", { name: "Previsualizar Promoción" })).toBeNull();
  await userEvent.click(screen.getByRole("button", { name: "Previsualizar Historia" }));
  expect(open).toHaveBeenCalledWith(expect.objectContaining({ url: "/media/exports/video.mp4" }));
  await userEvent.type(screen.getByRole("searchbox", { name: "Buscar piezas" }), "Inexistente");
  expect(screen.getByText("No encontré piezas con esa búsqueda.")).toBeTruthy();
  await userEvent.click(screen.getByRole("button", { name: "Mostrar todas" }));
  expect(screen.getAllByRole("button", { name: /Previsualizar/ })).toHaveLength(2);
});
