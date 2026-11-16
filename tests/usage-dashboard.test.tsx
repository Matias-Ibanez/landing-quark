import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { UsageDashboard } from "../src/app/chat/_components/usage-dashboard";
import type { CostSummary } from "../src/app/chat/_components/api";

const mockApi = vi.hoisted(() => vi.fn());
vi.mock("../src/app/chat/_components/api", () => ({ api: mockApi }));

it("shows production costs for the selected period without consulting the provider balance", async () => {
  const usage: CostSummary = {
    estimatedSpendUsd: 0.01, unpricedRuns: 0, incompleteCostOperations: 1, totalOperations: 1, meteredOperations: 1,
    agentRuns: 0, inputTokens: 120, outputTokens: 80, generatedImages: 0, generatedVideos: 0,
    dailySpend: [{ date: "2026-11-16", estimatedUsd: 0.01 }], runs: [],
  };
  let finishInitial!: (data: CostSummary) => void;
  const initial = new Promise<CostSummary>(resolve => { finishInitial = resolve; });
  mockApi.mockImplementation(async (path: string) => {
    return path === "/costs?days=30" ? initial : usage;
  });

  render(<UsageDashboard />);
  expect(screen.getByRole("status").textContent).toContain("Cargando");
  await userEvent.click(screen.getByRole("button", { name: "7 días" }));
  await screen.findByText("120 entrada · 80 salida");
  expect(screen.getByRole("button", { name: "7 días" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByText("Costos faltantes en 1 operación")).toBeTruthy();
  expect(screen.queryByText(/Saldo de DeepSeek/)).toBeNull();
  await act(async () => finishInitial({ ...usage, inputTokens: 900 }));
  expect(screen.queryByText("900 entrada · 80 salida")).toBeNull();
  expect(mockApi.mock.calls.map(([path]) => path)).toEqual(["/costs?days=30", "/costs?days=7"]);
});
