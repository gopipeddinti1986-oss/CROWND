import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./button";
import { Input } from "./input";
import { Alert } from "./alert";
import { Badge } from "./badge";

describe("Design System Primitives", () => {
  it("renders Button with primary variant and handles click", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles Button loading state with aria-busy and disabled", () => {
    render(<Button isLoading>Submitting</Button>);
    const btn = screen.getByRole("button", { name: /submitting/i });
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
  });

  it("renders Input with label, helper text, and accessible error state", () => {
    render(
      <Input
        label="Email Address"
        id="email-field"
        helperText="We will never share your email"
        error="Invalid email format"
        required
      />
    );

    const input = screen.getByLabelText(/^Email Address/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email format");
  });

  it("renders Input password toggle correctly", () => {
    const { container } = render(<Input label="Account Password" type="password" id="pwd" />);
    const input = container.querySelector("input#pwd") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button", { name: /show password/i });
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute("type", "text");
  });

  it("renders Alert with accessible roles and dismiss action", () => {
    const handleDismiss = vi.fn();
    render(
      <Alert variant="warning" title="Notice" dismissible onDismiss={handleDismiss}>
        Warning message content
      </Alert>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Notice")).toBeInTheDocument();

    const dismissBtn = screen.getByRole("button", { name: /dismiss alert/i });
    fireEvent.click(dismissBtn);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders Badge with correct variant classes", () => {
    render(<Badge variant="accent">Verified</Badge>);
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });
});
