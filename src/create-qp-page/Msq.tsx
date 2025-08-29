import { MdOutlineDragIndicator } from "react-icons/md";
import { FaImage } from "react-icons/fa6";

interface MSQProps {
  id: string;
  options: string[];
  answer: number[]; // Array of indices of selected options
  setAnswer: (indices: number[]) => void;
}

function Msq({ id, options, answer, setAnswer }: MSQProps) {
  const handleChange = (index: number) => {
    if (answer.includes(index)) {
      setAnswer(answer.filter((i) => i !== index));
    } else {
      setAnswer([...answer, index]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-10.5 text-2xl font-normal text-[#0E2023]">
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-4">
          <MdOutlineDragIndicator />
          <div className="flex w-full items-center gap-4 border-b border-[#8C8C8C] py-2.5">
            <input
              type="checkbox"
              checked={answer.includes(index)}
              name={`msq-option-${id}`}
              id={`option-${id}-${index}`}
              onChange={() => handleChange(index)}
            />
            <label htmlFor={`option-${id}-${index}`}>{option}</label>
            <FaImage className="ml-auto transform-[scale(-1,1)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Msq;
