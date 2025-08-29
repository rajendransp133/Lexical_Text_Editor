import { IoLogInOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userDataColor: string;
  userData: {
    name: string;
    role: string;
  };
}

const UserDropdown = ({
  isOpen,
  onClose,
  userDataColor,
  userData,
}: UserDropdownProps) => {
  const { role } = userData;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <aside className="animate-dropdownSlide absolute top-17 right-[-0.3rem] z-50 flex min-w-[250px] flex-col items-center justify-center rounded-custom-30 bg-white px-4 py-6 text-center shadow-xl transition-all duration-200 hover:shadow-2xl">
      <div className="mb-1 cursor-pointer self-end" onClick={handleClose}>
        <IoIosClose className="h-6 w-6" />
      </div>

      <div
        className="hover:shadow-secondary/30 mb-4 flex h-20 w-20 items-center justify-center rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
        style={{ backgroundColor: userDataColor }}
      >
        <p className="text-3xl font-medium text-primary-gray-light">
          {userData.name?.charAt(0)}
        </p>
      </div>

      <section className="flex flex-col items-center justify-center pb-4 text-lg whitespace-nowrap text-secondary-black">
        <p className="font-medium">You are logged in as</p>
        <p className="text-2xl font-semibold" style={{ color: userDataColor }}>
          {userData.name}
        </p>
        <p className="font-normal">
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </p>
      </section>

      <button
        className="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-t-ternary-gray-dark pt-4 text-2xl font-normal text-secondary-black transition-colors duration-200 hover:underline"
        onClick={() => {
          console.log("Logout");
        }}
      >
        <p>Log Out</p>
        <IoLogInOutline />
      </button>
    </aside>
  );
};

export default UserDropdown;
