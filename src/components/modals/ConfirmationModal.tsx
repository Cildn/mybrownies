// ConfirmationModal.tsx
"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

interface ConfirmationModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onConfirm: () => void; // Parent handles the confirmation logic
  actionType: "UPDATE" | "DELETE";
}

export default function ConfirmationModal({
  isOpen,
  closeModal,
  onConfirm,
  actionType,
}: ConfirmationModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (inputValue === actionType) {
      onConfirm(); // Delegate confirmation logic to the parent
      closeModal();
      setInputValue(""); // Reset input value
      setError(""); // Reset error message
    } else {
      setError(`Please type "${actionType}" to confirm`);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <ComponentCard title={`Confirm ${actionType}`} className="w-full max-w-md p-6">
        <div className="mb-4">
          <p className="text-gray-700">
            To confirm this {actionType.toLowerCase()} operation, please type "{actionType}" below:
          </p>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
        <div>
          <Label htmlFor="confirmation-input">{actionType}</Label>
          <Input
            id="confirmation-input"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError("");
            }}
            className="mt-2"
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant={actionType === "DELETE" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={inputValue !== actionType}
          >
            Confirm {actionType}
          </Button>
        </div>
      </ComponentCard>
    </div>
  ) : null;
}