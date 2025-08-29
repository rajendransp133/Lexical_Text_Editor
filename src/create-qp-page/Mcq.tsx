import { MdOutlineDragIndicator } from "react-icons/md";
import { FaImage } from "react-icons/fa6";

interface MCQProps {
  id: string;
  options: string[];
  answer: number; // Index of correct option
  setAnswer: (index: number) => void;
}

function Mcq({ id, options, answer, setAnswer }: MCQProps) {
  return (
    <div className="grid grid-cols-2 gap-10.5 text-2xl font-normal text-[#0E2023]">
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-4">
          <MdOutlineDragIndicator />
          <div className="flex w-full items-center gap-4 border-b border-[#8C8C8C] py-2.5">
            <input
              type="radio"
              name={`mcq-option-${id}`}
              id={`option-${id}-${index}`}
              checked={answer === index}
              onChange={() => setAnswer(index)}
            />
            <label htmlFor={`option-${id}-${index}`}>{option}</label>
            <FaImage className="ml-auto transform-[scale(-1,1)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Mcq;
