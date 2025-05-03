import React, { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useMutation, TypedDocumentNode } from "@apollo/client";
import { Category, ProductType } from "@/types";

interface FieldConfig {
  label: string;
  type: "text" | "number";
  placeholder: string;
  item: ProductType | Category | null;
}

interface ModalProps<TVariables, TResult> {
  closeModal: () => void;
  item: TVariables | null;
  mutation: TypedDocumentNode<TResult, TVariables>;
  fields: Record<keyof TVariables, FieldConfig>;
  onSubmitSuccess?: () => void;
}

export default function SharedUpdateModal<TVariables extends Record<string, unknown>, TResult>({
  closeModal,
  item,
  mutation,
  fields,
  onSubmitSuccess,
}: ModalProps<TVariables, TResult>) {
  const [state, setState] = useState<TVariables | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mutate] = useMutation<TResult, TVariables>(mutation);

  useEffect(() => {
    if (item) {
      setState(item);
    }
  }, [item]);

  const handleChange = (key: keyof TVariables, value: string) => {
    if (!state) return;

    const fieldType = fields[key]?.type;
    const processedValue = fieldType === "number" ? parseFloat(value) : value;

    setState({ ...state, [key]: processedValue });
  };

  const handleSubmit = async () => {
    if (!state) return;

    setLoading(true);
    setError("");

    try {
      await mutate({ variables: state });
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
      <ComponentCard
        title={`Update ${Object.values(fields)[0].label.split(" ")[0]}`}
        className="w-full max-w-md p-6"
      >
        <form>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {(Object.entries(fields) as [keyof TVariables, FieldConfig][]).map(
              ([key, { label, type, placeholder }]) => (
                <div key={String(key)}>
                  <Label>{label}</Label>
                  <Input
                    type={type}
                    placeholder={placeholder}
                    value={
                      (state[key] !== undefined && state[key] !== null
                        ? String(state[key])
                        : "") as string
                    }
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                </div>
              )
            )}
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
