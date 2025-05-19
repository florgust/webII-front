interface ModalProps {
    open: boolean;
    type: "success" | "error";
    message: string;
}

export default function Modal({ open, type, message }: Readonly<ModalProps>) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className={`p-6 rounded bg-neutral-800 text-center shadow-lg ${type === "success" ? "border-green-500 border" : "border-red-500 border"}`}>
                <p className={`text-lg ${type === "success" ? "text-green-400" : "text-red-400"}`}>{message}</p>
            </div>
        </div>
    );
}