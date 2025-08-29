import { useRef, useEffect } from "react";
import React from "react";

import { type ConfigQuestion, type ConfigSection } from "./configCreateQP";

export const Panel = React.memo(function Panel({
  sectionData,
  currentSection,
  handleLeft,
  handleRight,
  questionsData,
  currentIndex,
  setCurrentIndex,
  setSectionNavigation,
}: {
  sectionData: ConfigSection;
  currentSection: number;
  handleLeft: () => void;
  handleRight: () => void;
  questionsData: ConfigQuestion[];
  currentIndex: number;
  setCurrentIndex: (idx: number) => void;
  setSectionNavigation: (open: boolean) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setSectionNavigation(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSectionNavigation]);

  return (
    <div
      ref={panelRef}
      className="absolute top-62 right-85 z-50 flex w-fit flex-col gap-2 rounded-custom-30 bg-primary-gray-light p-4 font-semibold text-[#0E2023]"
    >
      <div className="flex items-center justify-between text-xl">
        <p className="cursor-pointer" onClick={handleLeft}>
          ←
        </p>
        <p>{sectionData.sectionName[currentSection] ?? ""}</p>
        <p className="cursor-pointer" onClick={handleRight}>
          →
        </p>
      </div>
      <div className="flex flex-col">
        {Array.from({
          length: Math.ceil(
            (sectionData.questionPerSection[currentSection] ?? 0) / 7
          ),
        }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 text-center">
            {Array.from({ length: 7 }).map((_, colIndex) => {
              const number = rowIndex * 7 + colIndex + 1;
              return number <=
                (sectionData.questionPerSection[currentSection] ?? 0) ? (
                <p
                  key={colIndex}
                  className={`flex h-[36px] w-[36px] cursor-pointer items-center justify-center text-xs ${
                    questionsData[currentIndex]?.sectionName ===
                      sectionData.sectionName[currentSection] &&
                    questionsData[currentIndex]?.questionNo === number
                      ? "rounded-full bg-[#263EAC] text-white"
                      : "hover:bg-gray-300"
                  }`}
                  onClick={() => {
                    const targetIndex = questionsData.findIndex(
                      (q) =>
                        q.sectionName ===
                          sectionData.sectionName[currentSection] &&
                        q.questionNo === number
                    );
                    if (targetIndex !== -1) setCurrentIndex(targetIndex);
                  }}
                >
                  {number}
                </p>
              ) : null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
});
