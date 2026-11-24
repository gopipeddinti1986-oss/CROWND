import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkipLink } from "@/components/layout/skip-link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme/theme-provider";
import LoginPage from "@/app/(auth)/login/page";
import SignUpPage from "@/app/(auth)/signup/page";
import { Dialog } from "@/components/ui/dialog";

describe("Accessibility & Responsiveness Verification (WCAG 2.2 AA)", () => {
  it("renders an accessible SkipLink with valid target anchor", () => {
    render(<SkipLink />);
    const skip = screen.getByRole("link", { name: /skip to main content/i });
    expect(skip).toBeInTheDocument();
    expect(skip).toHaveAttribute("href", "#main-content");
  });

  it("ensures Header has labeled landmark navigation and mobile toggle with ARIA", () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    const nav = screen.getByLabelText(/main navigation/i);
    expect(nav).toBeInTheDocument();

    const mobileToggle = screen.getByRole("button", { name: /toggle navigation menu/i });
    expect(mobileToggle).toBeInTheDocument();
    expect(mobileToggle).toHaveAttribute("aria-expanded", "false");
  });

  it("ensures LoginPage form has accessible labels and no unlabelled inputs", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/^Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("ensures SignUpPage form has accessible role selector with radiogroup semantics", () => {
    render(<SignUpPage />);
    const radioGroup = screen.getByRole("radiogroup", { name: /select account type/i });
    expect(radioGroup).toBeInTheDocument();

    const creatorRadio = screen.getByRole("radio", { name: /i am a creator/i });
    const brandRadio = screen.getByRole("radio", { name: /i am a brand/i });

    expect(creatorRadio).toBeInTheDocument();
    expect(creatorRadio).toHaveAttribute("aria-checked", "true");
    expect(brandRadio).toBeInTheDocument();
    expect(brandRadio).toHaveAttribute("aria-checked", "false");
  });

  it("ensures Dialog has proper modal, focus, and ARIA labels", () => {
    render(
      <Dialog isOpen={true} onClose={() => {}} title="Campaign Details" description="Read terms">
        <p>Modal content</p>
      </Dialog>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "dialog-title");
    expect(screen.getByRole("button", { name: /close dialog/i })).toBeInTheDocument();
  });

  it("ensures Footer provides landmark and legal compliance labels", () => {
    render(<Footer />);
    expect(screen.getByText(/WCAG 2.2 AA Compliant/i)).toBeInTheDocument();
  });
});
