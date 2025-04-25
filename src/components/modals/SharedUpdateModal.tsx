// SharedUpdateModal.tsx
"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useMutation } from "@apollo/client";

interface ModalProps<T> {
  closeModal: () => void;
  item: T | null;
  mutation: any;
  fields: { [key: string]: { label: string; type: string; placeholder: string } };
  onSubmitSuccess?: () => void;
}

export default function SharedUpdateModal<T>({
  closeModal,
  item,
  mutation,
  fields,
  onSubmitSuccess,
}: ModalProps<T>) {
  const [state, setState] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mutate] = useMutation(mutation);

  useEffect(() => {
    if (item) {
      setState(item);
    }
  }, [item]);

  const handleChange = (key: keyof T, value: any) => {
    if (!state) return;
    setState({ ...state, [key]: value });
  };

  const handleSubmit = async () => {
    if (!state) return;

    setLoading(true);
    setError("");

    try {
      await mutate({ variables: { ...state } });
      closeModal();
      onSubmitSuccess?.();
    } catch (err) {
      console.error("Error updating item:", err);
      setError("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!state) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <ComponentCard title={`Update ${Object.values(fields)[0].label.split(' ')[0]}`} className="w-full max-w-md p-6">
        <form>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Object.entries(fields).map(([key, { label, type, placeholder }]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  type={type}
                  placeholder={placeholder}
                  value={state[key as keyof T] || ""}
                  onChange={(e) => handleChange(key as keyof T, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}