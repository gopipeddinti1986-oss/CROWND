import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileCompletionWidget } from "./profile-completion-widget";

describe("ProfileCompletionWidget Component", () => {
  it("renders 100% completed profile state accurately", () => {
    const complete = {
      percentage: 100,
      completedFields: ["Company Name", "Website", "Industry", "Description"],
      missingFields: [],
    };

    render(<ProfileCompletionWidget completion={complete} role="brand" />);

    expect(screen.getByText("100% Completed")).toBeInTheDocument();
    expect(screen.getByText("All Set")).toBeInTheDocument();
    expect(screen.getByText("Company Name")).toBeInTheDocument();
  });

  it("renders in-progress profile state with missing fields and progress bar", () => {
    const partial = {
      percentage: 55,
      completedFields: ["Display Name & Handle", "Niche & Categories"],
      missingFields: ["Profile Photo", "Location & Languages"],
    };

    render(
      <ProfileCompletionWidget completion={partial} role="creator" editUrl="/dashboard/profile" />
    );

    expect(screen.getByText("55% Completed")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Profile Photo")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "55");
    expect(screen.getByText("Finish setup")).toBeInTheDocument();
  });
});
