import React, { useEffect, useState } from 'react';
import './Modal.css';

interface ModalProps {
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
    const [fadeOut, setFadeOut] = useState(false);
    const [fadeOutText, setFadeOutText] = useState(false);

    useEffect(() => {
        const textTimer = setTimeout(() => {
            setFadeOutText(true);
        }, 500);

        const modalTimer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                onClose();
            }, 1000);
        }, 1000);

        return () => {
            clearTimeout(textTimer);
            clearTimeout(modalTimer);
        };
    }, [onClose]);

    const handleClick = () => {
        setFadeOut(true);
        setFadeOutText(true);
        setTimeout(() => {
            onClose();
        }, 200);
    };

    return (
        <div className={`modal ${fadeOut ? 'fade-out' : ''}`} onClick={handleClick}>
            <div className={`modal-content ${fadeOutText ? 'fade-out-text' : ''}`}>
                <h1>WELCOME ON BOARD!</h1>
            </div>
        </div>
    );
};

export default Modal;