export interface DefaultModalProps<T = void, TRes = void> {
  id?: string;
  closeModal?: () => void;
  onSubmit?: (data?: TRes) => void;
  data?: T;
}
