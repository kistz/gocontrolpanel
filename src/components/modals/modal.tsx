"use client";
import {
  Children,
  cloneElement,
  Dispatch,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  useState,
} from "react";

interface ModalProps {
  isOpen?: boolean;
  setIsOpen?: Dispatch<React.SetStateAction<boolean>>;
}

export default function Modal({
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  children,
}: ModalProps & PropsWithChildren) {
  const isControlled =
    controlledIsOpen !== undefined && controlledSetIsOpen !== undefined;
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);

  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;
  const setIsOpen = isControlled ? controlledSetIsOpen : setUncontrolledIsOpen;

  const childrenArray = Children.toArray(children);

  let modalElement: ReactElement<{ closeModal?: () => void }> | null = null;
  if (childrenArray.length > 0 && isValidElement(childrenArray[0])) {
    modalElement = childrenArray[0] as ReactElement<{
      closeModal?: () => void;
    }>;
  }

  let triggerElement: ReactElement<{ onClick?: () => void }> | null = null;
  if (childrenArray.length > 1 && isValidElement(childrenArray[1])) {
    triggerElement = childrenArray[1] as ReactElement<{ onClick?: () => void }>;
  }

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
          className="fixed top-0 left-0 z-[9998] p-4 flex h-screen w-screen items-center justify-center bg-black/50"
          onClick={handleBackdropClick}
        >
          {cloneElement(modalElement, { closeModal: closeModal })}
        </div>
      )}
    </>
  );
}
