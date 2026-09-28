import { expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ResourceCard, ResourcePreview, galleryForJob } from "../src/app/chat/_components/resource-preview";
import type { Job } from "../src/app/chat/_components/api";

it("preserves SVG and PNG downloads in the click-to-open dialog", async () => {
  const close = vi.fn();
  const { rerender } = render(<ResourcePreview item={null} onClose={close} />);
  expect(screen.queryByRole("dialog")).toBeNull();
  rerender(<ResourcePreview item={{ url: "/media/exports/post.svg", title: "Mi publicación" }} onClose={close} />);
  expect(await screen.findByRole("dialog", { name: "Mi publicación" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "SVG vectorial" }).getAttribute("href")).toBe("/media/exports/post.svg");
  expect(screen.getByRole("link", { name: "PNG" }).getAttribute("href")).toBe("/media/exports/post.png");
  fireEvent.keyDown(document.activeElement!, { key: "Escape" });
  await waitFor(() => expect(close).toHaveBeenCalled());
});

it("shows PDF cover and full document link", async () => {
  render(<ResourcePreview item={{ url: "/media/assets/report.pdf", title: "Informe", document: { pages: 3, textStatus: "ocr", textTruncated: false, previewUrl: "/media/assets/report-preview.png" } }} onClose={vi.fn()} />);
  await screen.findByRole("dialog");
  expect(screen.getByRole("img", { name: "Primera página del PDF" }).getAttribute("src")).toMatch(/preview.png$/);
  expect(screen.getByRole("link", { name: "Abrir PDF completo" }).getAttribute("href")).toBe("/media/assets/report.pdf");
});

it("keeps failed thumbnails clickable without nested buttons", () => {
  const open = vi.fn();
  const { container } = render(<ResourceCard item={{ url: "/media/assets/photo.png", title: "Producto" }} onOpen={open} />);
  fireEvent.error(container.querySelector("img")!);
  expect(container.querySelector("button button")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Previsualizar Producto" }));
  expect(open).toHaveBeenCalledTimes(1);
});

it("opens the selected slide and navigates with arrows, keyboard and touch while preserving downloads", async () => {
  const slides = [1, 2, 3].map(i => ({ url: `/media/exports/slide-${i}.svg`, title: `Lámina ${i}` }));
  render(<ResourcePreview item={{ ...slides[1], gallery: slides }} onClose={vi.fn()} />);
  const dialog = await screen.findByRole("dialog");
  expect(screen.getByText("Imagen 2 de 3")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Imagen siguiente" }));
  expect(screen.getByRole("link", { name: "SVG vectorial" }).getAttribute("href")).toBe(slides[2].url);
  expect((screen.getByRole("button", { name: "Imagen siguiente" }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.keyDown(dialog, { key: "ArrowLeft" });
  expect(screen.getByText("Imagen 2 de 3")).toBeTruthy();
  const image = screen.getByRole("img");
  fireEvent.touchStart(image, { touches: [{ clientX: 30, clientY: 50 }], changedTouches: [{ clientX: 30, clientY: 50 }] });
  fireEvent.touchEnd(image, { changedTouches: [{ clientX: 130, clientY: 55 }] });
  expect(screen.getByText("Imagen 1 de 3")).toBeTruthy();
  expect(screen.getByRole("link", { name: "PNG" }).getAttribute("href")).toBe("/media/exports/slide-1.png");
});

it("orders only the slides from the same carousel and project", () => {
  const job = (id: string, slideIndex: number, carouselId = "first", project_id = "p") => ({ id, project_id, kind: "render", status: "done", payload: { kind: "png", carouselId, slideIndex, document: { caption: "" } }, result: { url: `/media/exports/${id}.png`, vectorUrl: `/media/exports/${id}.svg` } }) as Job;
  const one = job("one", 1);
  expect(galleryForJob(one, [job("two", 2), job("other", 1, "second"), job("foreign", 1, "first", "different"), one])?.map(slide => slide.url)).toEqual(["/media/exports/one.svg", "/media/exports/two.svg"]);
});
