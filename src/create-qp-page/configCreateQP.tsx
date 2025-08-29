import type { JEEStructure } from "./types_qp";
import { qp } from "../../assets/qp";

const presetdata: JEEStructure = qp;

export type ConfigQuestion = {
  sectionName: string;
  questionNo: number;
  type: string;
  positive: number;
  negative: number;
};

export type ConfigSection = {
  sectionName: string[];
  questionPerSection: number[];
};

export const questions = (): ConfigQuestion[] => {
  const flat: ConfigQuestion[] = [];

  presetdata.section?.forEach((sectionItem) => {
    const qpno: number = sectionItem.totalquestion;
    let currentCount = 1;
    sectionItem.weightage.forEach((questionItem) => {
      for (let i = 0; i < questionItem.count; i++) {
        if (currentCount <= qpno) {
          flat.push({
            sectionName: sectionItem.name,
            questionNo: currentCount,
            type: questionItem.type,
            positive: questionItem.positive,
            negative: questionItem.negative,
          });
          currentCount = currentCount + 1;
        }
      }
    });
  });
  return flat;
};

export const section = (): ConfigSection => {
  const sectionName = presetdata.section?.map((s) => s.name);
  const questionPerSection = presetdata.section?.map((s) => s.totalquestion);
  return { sectionName, questionPerSection };
};
