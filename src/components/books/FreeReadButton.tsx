import ServerApi from "@/api/ServerAPI";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface FreeReadButtonProps {
    googleBooksId: string;
    bookTitle?: string;
}

export default function FreeReadButton({
    googleBooksId,
    bookTitle = "",
}: FreeReadButtonProps) {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const [available, setAvailable] = useState(false);
    const [iaId, setIaId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function checkAvailability() {
            try {
                setChecking(true);
                const response = await ServerApi.checkFreeBook(googleBooksId);
                if (!cancelled) {
                    setAvailable(response.data.available);
                    setIaId(response.data.ia_id || null);
                }
            } catch {
                if (!cancelled) {
                    setAvailable(false);
                }
            } finally {
                if (!cancelled) {
                    setChecking(false);
                }
            }
        }

        if (googleBooksId) {
            checkAvailability();
        } else {
            setChecking(false);
        }

        return () => {
            cancelled = true;
        };
    }, [googleBooksId]);

    if (checking) {
        return (
            <span className="text-xs text-gray-400 italic">
                Checking free availability...
            </span>
        );
    }

    if (!available || !iaId) {
        return null;
    }

    return (
        <Button
            onClick={() => {
                const params = new URLSearchParams();
                if (bookTitle) params.set("title", bookTitle);
                if (googleBooksId) params.set("bookId", googleBooksId);
                navigate(`/read/${encodeURIComponent(iaId)}?${params.toString()}`);
            }}
            className="bg-green-600 hover:bg-green-700 text-white"
        >
            Read Free
        </Button>
    );
}
