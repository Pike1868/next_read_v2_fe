import Modal from "@/components/ui/modal";
import React from "react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onConfirm,
    onCancel,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onCancel}
            onConfirm={onConfirm}
            title="Confirm Account Deletion"
        >
            <p className="text-sm break-words sm:text-base">
                Are you sure you want to delete your account?
            </p>
            <p className="mt-2 text-sm font-semibold text-red-600 break-words sm:text-base">
                This action cannot be undone.
            </p>
        </Modal>
    );
};

export default ConfirmDeleteModal;
