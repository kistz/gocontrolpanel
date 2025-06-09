export interface DefaultModalProps<T = void, TRes = void> {
  serverUuid?: string;
  closeModal?: () => void;
  onSubmit?: (data?: TRes) => void;
  data?: T;
}
