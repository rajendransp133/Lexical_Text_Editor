import { useState } from "react";

interface NATProps {
  start: number;
  end: number;
  precision: number;
  setValues: (values: {
    start: number;
    end: number;
    precision: number;
  }) => void;
}

function Nat({ start, end, precision, setValues }: NATProps) {
  const [clearedFields, setClearedFields] = useState<{
    start: boolean;
    end: boolean;
    precision: boolean;
  }>({ start: false, end: false, precision: false });

  const handleInputChange = (
    field: "start" | "end" | "precision",
    value: string
  ) => {
    const isCleared = value === "";
    setClearedFields((prev) => ({ ...prev, [field]: isCleared }));

    const numValue = isCleared ? 0 : Number(value);

    setValues({
      start: field === "start" ? numValue : start,
      end: field === "end" ? numValue : end,
      precision: field === "precision" ? numValue : precision,
    });
  };

  return (
    <div className="flex flex-col gap-4 text-2xl font-normal">
      <div className="py-4">
        <span>Number Between </span>
        <input
          className="no-spinner w-[10rem] border-b border-[#8C8C8C] pl-2"
          type="number"
          inputMode="decimal"
          step="any"
          placeholder="From"
          value={clearedFields.start ? "" : start || ""}
          onChange={(e) => handleInputChange("start", e.target.value)}
        />
        <span> and </span>
        <input
          className="no-spinner w-[10rem] border-b border-[#8C8C8C] pl-2"
          type="number"
          inputMode="decimal"
          step="any"
          placeholder="To"
          value={clearedFields.end ? "" : end || ""}
          onChange={(e) => handleInputChange("end", e.target.value)}
        />
      </div>
      <div className="py-4">
        <span>No of floating point digit:</span>
        <input
          className="no-spinner w-[10rem] border-b border-[#8C8C8C] pl-2"
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="e.g. 2"
          value={clearedFields.precision ? "" : precision || ""}
          onChange={(e) => handleInputChange("precision", e.target.value)}
        />
      </div>
    </div>
  );
}

export default Nat;
