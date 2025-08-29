import React from "react";

import { useState, useEffect } from "react";

import { PiNotepadBold } from "react-icons/pi";
import { BsFillInboxesFill } from "react-icons/bs";

import { qp } from "../../assets/qp";
import { qp2 } from "../../assets/qp2";
import { qp3 } from "../../assets/qp3";
import { qp4 } from "../../assets/qp4";

import type { JEEStructure, Section, Weightage } from "./types_qp";

import {
  questions as defaultQuestions,
  section as defaultSection,
  type ConfigQuestion,
  type ConfigSection,
} from "./configCreateQP";

import { Panel } from "./Panel";
import Navbar from "./NavBar";

import Mcq from "./Mcq";
import Msq from "./Msq";
import Nat from "./Nat";

// Map of question papers
const questionPapers: { [key: number]: JEEStructure } = {
  1: qp,
  2: qp2,
  3: qp3,
  4: qp4,
};

const qpList = [1, 2, 3, 4];

function CreateQpPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [sectionNavigation, setSectionNavigation] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [activePaper, setActivePaper] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<{ [key: number]: number }>({});
  const [msqAnswers, setMsqAnswers] = useState<{ [key: number]: number[] }>({});

  const [natAnswers, setNatAnswers] = useState<{
    [key: number]: { start: number; end: number; precision: number };
  }>({});
  const [instructionOpen, setInstructionOpen] = useState(true);

  // Store question text inputs for each question index
  const [questionTexts, setQuestionTexts] = useState<{ [key: number]: string }>(
    {}
  );
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [newQuestionAnswer, setNewQuestionAnswer] = useState<number | number[]>(
    []
  );
  const [newQuestionNatValues, setNewQuestionNatValues] = useState({
    start: 0,
    end: 100,
    precision: 0,
  });

  // Get current question paper data based on activePaper
  const presetdata: JEEStructure = questionPapers[activePaper] || qp;

  const questionsData: ConfigQuestion[] = defaultQuestions();
  const sectionData: ConfigSection = defaultSection();

  const currentQuestion: ConfigQuestion = questionsData[currentIndex];

  function getNatIndex(sectionName: string, questionNo: number) {
    const section = presetdata.section?.find((s) => s.name === sectionName);
    if (!section) return 0;
    let natCount = 0;
    let currentCount = 1;
    for (const w of section.weightage) {
      for (let i = 0; i < w.count; i++) {
        if (currentCount === questionNo) {
          if (w.type === "nat") return natCount;
          else return -1;
        }
        if (w.type === "nat") natCount++;
        currentCount++;
      }
    }
    return -1;
  }

  function getTypeIndex(
    sectionName: string,
    questionNo: number,
    type: "mcq" | "msq" | "nat"
  ) {
    const section = presetdata.section?.find((s) => s.name === sectionName);
    if (!section) return -1;
    let typeCount = 0;
    let currentCount = 1;
    for (const w of section.weightage) {
      for (let i = 0; i < w.count; i++) {
        if (currentCount === questionNo) {
          if (w.type === type) return typeCount;
          else return -1;
        }
        if (w.type === type) typeCount++;
        currentCount++;
      }
    }
    return -1;
  }

  let questionProps: any = null;
  let questionText = "";

  let isPlaceholder = false;
  if (currentQuestion.type === "mcq") {
    const section = presetdata.section?.find(
      (s) => s.name === currentQuestion.sectionName
    );

    const mcqList =
      section?.weightage.find((w) => w.type === "mcq")?.questions || [];

    const mcqIndex = getTypeIndex(
      currentQuestion.sectionName,
      currentQuestion.questionNo,
      "mcq"
    );
    const mcqQ = mcqList[mcqIndex] || mcqList[0] || {};

    questionProps = {
      id: mcqQ.id || `mcq-${currentIndex}`,
      options: mcqQ.options || ["Option 1", "Option 2", "Option 3", "Option 4"],
      answer: mcqAnswers[currentIndex] ?? mcqQ.answer ?? -1,
      setAnswer: (idx: number) =>
        setMcqAnswers((a) => ({ ...a, [currentIndex]: idx })),
    };

    questionText = mcqQ.question || "";

    isPlaceholder = !mcqQ.question;
  } else if (currentQuestion.type === "msq") {
    const section = presetdata.section?.find(
      (s) => s.name === currentQuestion.sectionName
    );

    const msqList =
      section?.weightage.find((w) => w.type === "msq")?.questions || [];

    const msqIndex = getTypeIndex(
      currentQuestion.sectionName,
      currentQuestion.questionNo,
      "msq"
    );
    const msqQ = msqList[msqIndex] || msqList[0] || {};

    questionProps = {
      id: msqQ.id || `msq-${currentIndex}`,
      options: msqQ.options || ["Option 1", "Option 2", "Option 3", "Option 4"],
      answer: msqAnswers[currentIndex] ?? msqQ.answer ?? [],
      setAnswer: (indices: number[]) =>
        setMsqAnswers((a) => ({ ...a, [currentIndex]: indices })),
    };

    questionText = msqQ.question || "";

    isPlaceholder = !msqQ.question;
  } else if (currentQuestion.type === "nat") {
    const section = presetdata.section?.find(
      (s) => s.name === currentQuestion.sectionName
    );

    const natList =
      section?.weightage.find((w) => w.type === "nat")?.questions || [];

    const natIndex = getNatIndex(
      currentQuestion.sectionName,
      currentQuestion.questionNo
    );

    const natQ = natList[natIndex] || natList[0] || {};

    questionProps = {
      id: natQ.id || `nat-${currentIndex}`,
      start: natAnswers[currentIndex]?.start ?? natQ.start ?? 0,
      end: natAnswers[currentIndex]?.end ?? natQ.end ?? 100,
      precision: natAnswers[currentIndex]?.precision ?? natQ.precision ?? 0,

      setValues: (values: { start: number; end: number; precision: number }) =>
        setNatAnswers((prev) => ({ ...prev, [currentIndex]: values })),
    };

    isPlaceholder = !natQ.question;
  }

  const paperQuestionText = questionText;

  const handleNext = () => {
    if (currentIndex < questionsData.length - 1)
      setCurrentIndex((prev) => prev + 1);
    else console.log("preview");
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleLeft = () => {
    setCurrentSection((prev) =>
      prev === 0 ? sectionData.sectionName.length - 1 : prev - 1
    );
  };

  const handleRight = () => {
    setCurrentSection((prev) =>
      prev === sectionData.sectionName.length - 1 ? 0 : prev + 1
    );
  };

  const handlePaperSelect = (paperNumber: number) => {
    setActivePaper(paperNumber);
  };

  const handleCancelCreate = () => {
    setQuestionTexts((prev) => ({ ...prev, [currentIndex]: "" }));
    setNewQuestionOptions(["", "", "", ""]);
    setNewQuestionAnswer([]);
    setNewQuestionNatValues({ start: 0, end: 100, precision: 0 });
  };

  const handleSaveNewQuestion = () => {
    // Save the current question text to persistent storage
    const currentText = questionTexts[currentIndex] || "";
    if (currentText.trim()) {
      setQuestionTexts((prev) => ({
        ...prev,
        [currentIndex]: currentText.trim(),
      }));
    }
    // Clear the editing state
    setNewQuestionOptions(["", "", "", ""]);
    setNewQuestionAnswer([]);
    setNewQuestionNatValues({ start: 0, end: 100, precision: 0 });
  };

  // Helper function to get question text for a specific paper
  const getQuestionTextForPaper = (paperNumber: number): string => {
    const paperData = questionPapers[paperNumber] || qp;
    const section = paperData.section?.find(
      (s) => s.name === currentQuestion.sectionName
    );

    if (!section) return "";

    if (currentQuestion.type === "mcq") {
      const mcqList =
        section.weightage.find((w) => w.type === "mcq")?.questions || [];
      const mcqQ = mcqList[currentQuestion.questionNo - 1] || mcqList[0] || {};
      return mcqQ.question || "";
    } else if (currentQuestion.type === "msq") {
      const msqList =
        section.weightage.find((w) => w.type === "msq")?.questions || [];
      const msqQ = msqList[currentQuestion.questionNo - 1] || msqList[0] || {};
      return msqQ.question || "";
    } else if (currentQuestion.type === "nat") {
      const natList =
        section.weightage.find((w) => w.type === "nat")?.questions || [];
      const natIdx = getNatIndex(
        currentQuestion.sectionName,
        currentQuestion.questionNo
      );
      const natQ = natList[natIdx] || {};
      return natQ.question || "";
    }

    return "";
  };

  // Removed unused handleSaveQuestion function

  return (
    <main className="flex h-screen flex-col gap-6 bg-[#EFF0F5]">
      <nav>
        <Navbar />
      </nav>
      <article className="mx-7.5 flex flex-1 flex-col justify-between gap-15 rounded-4xl bg-white p-6">
        <div className="flex flex-col gap-15">
          <header className="flex items-center justify-between">
            <section className="flex text-2xl font-semibold text-[#0E2023]">
              <span>QP |&nbsp;</span>
              <span>JEE Mains Paper 01</span>
            </section>
            <section className="flex items-center gap-4">
              <span className="text-lg font-normal text-[#8C8C8C]">
                Progress
              </span>
              <div className="h-2 w-[26.25rem] rounded-4xl bg-[#EFF0F5]">
                <div
                  className="h-full rounded-4xl bg-[#1FB67C]"
                  style={{
                    width: `${
                      ((currentIndex + 1) / questionsData.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </section>
            <nav className="flex gap-4 text-2xl font-normal">
              <button
                className="rounded-full border border-[#0E2023] p-4.5 text-[#0E2023] hover:cursor-pointer disabled:opacity-40"
                onClick={() => setSectionNavigation(!sectionNavigation)}
              >
                <BsFillInboxesFill size={30} />
              </button>

              <button
                className="rounded-4xl border border-[#0E2023] px-9 py-4.5 text-[#0E2023] hover:cursor-pointer disabled:opacity-40"
                onClick={handleBack}
                disabled={currentIndex === 0}
              >
                ← Back
              </button>
              <button
                className="rounded-4xl bg-[#263EAC] px-9 py-4.5 text-[#EFF0F5] hover:cursor-pointer disabled:opacity-40"
                onClick={handleNext}
              >
                {currentIndex === questionsData.length - 1
                  ? "Preview & Sign-Off →"
                  : "Next Question →"}
              </button>
            </nav>
          </header>

          {sectionNavigation && (
            <Panel
              sectionData={sectionData}
              currentSection={currentSection}
              handleLeft={handleLeft}
              handleRight={handleRight}
              questionsData={questionsData}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              setSectionNavigation={setSectionNavigation}
            />
          )}

          {!drawerOpen && (
            <>
              <section className="flex items-center justify-between text-2xl font-semibold text-[#0E2023]">
                <article className="flex basis-4/5 flex-col gap-2">
                  <header className="font-normal text-[#8C8C8C]">
                    {currentQuestion.sectionName} | Question Number{" "}
                    {currentQuestion.questionNo}
                  </header>
                  <section>
                    {isPlaceholder ? (
                      <textarea
                        className="w-full min-h-[120px] p-4 border border-[#8C8C8C] rounded-4xl resize-vertical bg-transparent text-2xl font-semibold text-[#0E2023] placeholder:text-[#8C8C8C] focus:outline-none focus:border-[#263EAC]"
                        value={questionTexts[currentIndex] || ""}
                        onChange={(e) =>
                          setQuestionTexts((prev) => ({
                            ...prev,
                            [currentIndex]: e.target.value,
                          }))
                        }
                        placeholder="Enter your question here..."
                      />
                    ) : questionText ? (
                      <span>{questionText}</span>
                    ) : (
                      <textarea
                        className="w-full min-h-[120px] p-4 border border-[#8C8C8C] rounded-4xl resize-vertical bg-transparent text-2xl font-semibold text-[#0E2023] placeholder:text-[#8C8C8C] focus:outline-none focus:border-[#263EAC]"
                        value={questionTexts[currentIndex] || ""}
                        onChange={(e) =>
                          setQuestionTexts((prev) => ({
                            ...prev,
                            [currentIndex]: e.target.value,
                          }))
                        }
                        placeholder="Enter the question here or click here to add an image"
                      />
                    )}
                  </section>
                </article>
                <aside className="flex basis-1/5 justify-end gap-15">
                  <section className="flex flex-col gap-2">
                    <header className="font-normal text-[#8C8C8C]">
                      Marks
                    </header>
                    <div className="text-base">
                      <span className="rounded-4xl bg-[#91FFD5] p-2 text-[#093E29]">
                        {currentQuestion.positive}
                      </span>
                      <span>&nbsp;|&nbsp;</span>
                      <span className="rounded-4xl bg-[#FFEDED] p-2 text-[#642929]">
                        {currentQuestion.negative}
                      </span>
                    </div>
                  </section>
                  <section className="flex flex-col gap-2">
                    <header className="justify-between font-normal text-ternary-gray-dark">
                      Question Type
                    </header>
                    <div className="flex items-center">
                      <label htmlFor="type">
                        {currentQuestion.type.toUpperCase()}
                      </label>
                    </div>
                  </section>
                </aside>
              </section>
              <section>
                {isPlaceholder ? (
                  <>
                    {currentQuestion.type === "mcq" && (
                      <div className="grid grid-cols-2 gap-10.5 text-2xl font-normal text-[#0E2023]">
                        {newQuestionOptions.map((option, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="flex w-full items-center gap-4 border-b border-[#8C8C8C] py-2.5">
                              <input
                                type="radio"
                                name="new-mcq-option"
                                checked={newQuestionAnswer === index}
                                onChange={() => setNewQuestionAnswer(index)}
                              />
                              <input
                                type="text"
                                className="flex-1 border-none bg-transparent outline-none"
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...newQuestionOptions];
                                  newOptions[index] = e.target.value;
                                  setNewQuestionOptions(newOptions);
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {currentQuestion.type === "msq" && (
                      <div className="grid grid-cols-2 gap-10.5 text-2xl font-normal text-[#0E2023]">
                        {newQuestionOptions.map((option, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="flex w-full items-center gap-4 border-b border-[#8C8C8C] py-2.5">
                              <input
                                type="checkbox"
                                checked={
                                  Array.isArray(newQuestionAnswer) &&
                                  newQuestionAnswer.includes(index)
                                }
                                onChange={() => {
                                  if (Array.isArray(newQuestionAnswer)) {
                                    if (newQuestionAnswer.includes(index)) {
                                      setNewQuestionAnswer(
                                        newQuestionAnswer.filter(
                                          (i) => i !== index
                                        )
                                      );
                                    } else {
                                      setNewQuestionAnswer([
                                        ...newQuestionAnswer,
                                        index,
                                      ]);
                                    }
                                  }
                                }}
                              />
                              <input
                                type="text"
                                className="flex-1 border-none bg-transparent outline-none"
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...newQuestionOptions];
                                  newOptions[index] = e.target.value;
                                  setNewQuestionOptions(newOptions);
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {currentQuestion.type === "nat" && (
                      <div className="flex flex-col gap-4 text-2xl font-normal">
                        <div className="py-4">
                          <span>Number Between </span>
                          <input
                            className="no-spinner w-[10rem] border-b border-[#8C8C8C] pl-2"
                            type="number"
                            inputMode="decimal"
                            step="any"
                            placeholder="From"
                            value={newQuestionNatValues.start || ""}
                            onChange={(e) =>
                              setNewQuestionNatValues((prev) => ({
                                ...prev,
                                start: Number(e.target.value) || 0,
                              }))
                            }
                          />
                          <span>and</span>
                          <input
                            className="no-spinner w-[10rem] border-b border-[#8C8C8C] pl-2"
                            type="number"
                            inputMode="decimal"
                            step="any"
                            placeholder="To"
                            value={newQuestionNatValues.end || ""}
                            onChange={(e) =>
                              setNewQuestionNatValues((prev) => ({
                                ...prev,
                                end: Number(e.target.value) || 0,
                              }))
                            }
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
                            value={newQuestionNatValues.precision || ""}
                            onChange={(e) =>
                              setNewQuestionNatValues((prev) => ({
                                ...prev,
                                precision: Number(e.target.value) || 0,
                              }))
                            }
                          />
                        </div>
                      </div>
                    )}
                    <div className="mt-6 flex justify-end gap-4">
                      <button
                        className="rounded-4xl border border-[#0E2023] px-9 py-4.5 text-[#0E2023] hover:cursor-pointer"
                        onClick={handleCancelCreate}
                      >
                        Cancel
                      </button>
                      <button
                        className="rounded-4xl bg-[#1FB67C] px-9 py-4.5 text-[#EFF0F5] hover:cursor-pointer"
                        onClick={handleSaveNewQuestion}
                        disabled={!(questionTexts[currentIndex] || "").trim()}
                      >
                        Save Question
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {currentQuestion.type === "mcq" && (
                      <Mcq {...questionProps} />
                    )}
                    {currentQuestion.type === "msq" && (
                      <Msq {...questionProps} />
                    )}
                    {currentQuestion.type === "nat" && (
                      <Nat {...questionProps} />
                    )}
                  </>
                )}
              </section>
            </>
          )}

          {drawerOpen && (
            <section className="grid grid-cols-2 gap-6">
              {qpList.map((paperNumber) => {
                const isActive = activePaper === paperNumber;
                const paperQuestionText = getQuestionTextForPaper(paperNumber);

                return (
                  <div
                    key={paperNumber}
                    className={`flex cursor-pointer flex-col gap-4 rounded-4xl border p-6 transition-all duration-200 ${
                      isActive
                        ? "border-2 border-[#1FB67C] bg-[#EEFFF5]"
                        : "bg-[#EFF0F5] hover:border-[#1FB67C]"
                    }`}
                    onClick={() => handlePaperSelect(paperNumber)}
                  >
                    <div className={`text-2xl font-normal text-[#0E2023]`}>
                      Paper No. {paperNumber.toString().padStart(2, "0")}
                    </div>

                    <div className="text-2xl font-normal text-[#8C8C8C]">
                      {currentQuestion.sectionName} | Question Number{" "}
                      {currentQuestion.questionNo}
                    </div>

                    <div className="text-2xl font-semibold text-[#0E2023]">
                      {paperQuestionText}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          <footer className="flex flex-col gap-4">
            <nav className="flex items-center justify-end gap-4 text-2xl font-normal">
              {/* <div className="flex items-center justify-center gap-2">
              <FaKeyboard />
              <p>↓</p>
            </div> */}
              <button className="cursor-pointer rounded-4xl border border-secondary-black px-9 py-4.5">
                Submit Solution
              </button>

              <button
                className="flex h-15 w-15 items-center justify-center rounded-4xl bg-[#263EAC] p-4 text-[#EFF0F5] hover:cursor-pointer disabled:opacity-40"
                onClick={() => setInstructionOpen(true)}
              >
                <PiNotepadBold size={30} />
              </button>
            </nav>
          </footer>
        </div>
      </article>
    </main>
  );
}

export default CreateQpPage;
