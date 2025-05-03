"use client";
import {
  Children,
  cloneElement,
  Dispatch,
  isValidElement,
  ReactElement,
  ReactNode,
  useState,
} from "react";

interface ModalProps {
  isOpen?: boolean;
  setIsOpen?: Dispatch<React.SetStateAction<boolean>>;
}

function Modal({
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  children,
}: ModalProps & { children: ReactNode }) {
  const isControlled =
    controlledIsOpen !== undefined && controlledSetIsOpen !== undefined;
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);

  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;
  const setIsOpen = isControlled ? controlledSetIsOpen : setUncontrolledIsOpen;

  let triggerElement: ReactElement | null = null;
  let modalElement: ReactElement | null = null;

  // Process children to extract ModalTrigger and ModalContent
  console.log("Children:", children);
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const displayName =
      child.type && (child.type as React.ComponentType<any>).displayName;

    if (displayName === "ModalTrigger") {
      triggerElement = child;
    } else if (displayName === "ModalContent") {
      modalElement = child;
    }
  });

  const handleBackdropClick = () => {
    setIsOpen(false);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {triggerElement &&
        cloneElement(triggerElement, {
          onClick: () => setIsOpen(true),
        })}

      {isOpen && modalElement && (
        <div
          className="fixed top-0 left-0 z-[9998] flex h-screen w-screen items-center justify-center bg-black/50"
          onClick={handleBackdropClick}
        >
          {cloneElement(modalElement, { closeModal })}
        </div>
      )}
    </>
  );
}

const ModalTrigger: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
ModalTrigger.displayName = "ModalTrigger";
Modal.Trigger = ModalTrigger;

const ModalContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
ModalContent.displayName = "ModalContent";
Modal.Content = ModalContent;

export default Modal;
