export interface DefaultModalProps<T = void, TRes = void> {
  closeModal?: () => void;
  onSubmit?: (data?: TRes) => void;
  data?: T;
}
