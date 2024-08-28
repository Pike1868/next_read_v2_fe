import { Button } from "@/components/ui/button";
import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
}) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative flex items-center justify-center w-full max-w-sm mx-auto my-6 sm:max-w-md">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-3 border-b border-solid rounded-t sm:p-5 border-blueGray-200">
                        <h3 className="text-lg font-semibold break-words sm:text-xl">
                            {title}
                        </h3>
                        <button
                            className="float-right p-1 ml-auto text-2xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
                            onClick={onClose}
                        >
                            <span className="block w-6 h-6 text-2xl text-black bg-transparent outline-none opacity-5 focus:outline-none">
                                ×
                            </span>
                        </button>
                    </div>
                    <div className="relative flex-auto p-4 sm:p-6 text-sm sm:text-base max-h-[60vh] overflow-y-auto">
                        {children}
                    </div>
                    <div className="flex flex-col items-center justify-end p-3 space-y-2 border-t border-solid rounded-b sm:flex-row sm:p-6 border-blueGray-200 sm:space-y-0 sm:space-x-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="w-full text-xs sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            className="w-full text-xs sm:w-auto sm:text-sm"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
