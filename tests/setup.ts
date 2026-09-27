import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(cleanup);
Element.prototype.scrollIntoView = vi.fn();
// Icon glyphs are decorative; keep tests focused on accessible controls.
vi.mock("@phosphor-icons/react", () => Object.fromEntries([
  "Plus", "ArrowUp", "FilePdf", "Waveform", "X", "ArrowRight", "Check", "PencilSimple",
  "Sparkle", "ImageSquare", "FilmStrip", "Lightbulb", "DownloadSimple", "Play", "ArrowUpRight", "FolderSimple",
].map(name => [name, () => null])));
