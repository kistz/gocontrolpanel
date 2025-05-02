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
  children: ReactNode;
}

export function Modal({
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  children,
}: ModalProps) {
  const isControlled =
    controlledIsOpen !== undefined && controlledSetIsOpen !== undefined;
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);

  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;
  const setIsOpen = isControlled ? controlledSetIsOpen : setUncontrolledIsOpen;

  let triggerElement: ReactElement | null = null;
  let modalElement: ReactElement | null = null;

  Children.forEach(children, (child: any) => {
    if (child?.type === Modal.Trigger) {
      triggerElement = child.props.children;
    } else if (child?.type === Modal.Content) {
      modalElement = child.props.children;
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
        isValidElement(triggerElement) &&
        cloneElement(triggerElement, {
          onClick: () => setIsOpen(true),
        })}

      {isOpen && modalElement && isValidElement(modalElement) && (
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

Modal.Trigger = function ModalTrigger({
  children,
}: {
  children: ReactElement;
}) {
  return children;
};

Modal.Content = function ModalContent({
  children,
}: {
  children: ReactElement;
}) {
  return children;
};
