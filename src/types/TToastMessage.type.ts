export type TToastMessageProps = {
    status: 'success' | 'alert' | 'warn' | unknown;
    message: string;
    open: boolean;
    onClose: () => void;
}