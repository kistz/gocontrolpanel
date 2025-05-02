import { SetStateAction } from "react";

export interface DefaultModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: SetStateAction<boolean>) => void;
}
