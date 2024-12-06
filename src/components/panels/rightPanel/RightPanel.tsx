import React, { useState, useEffect, useRef } from 'react';
import './RightPanel.css';
import '../Panels.css';
import astronautsImage from './astronautsImage.png'; // Import the image

interface RightPanelProps {
    logMessage: string;
}

const RightPanel: React.FC<RightPanelProps> = ({ logMessage }) => {
    const [utcTime, setUtcTime] = useState(new Date());
    const [advice, setAdvice] = useState('');
    const [showAdvice, setShowAdvice] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logMonitorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setUtcTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const updateContent = async () => {
            // Fetch advice
            try {
                const response = await fetch('https://api.adviceslip.com/advice');
                const data = await response.json();
                setAdvice(data.slip.advice);
                setShowAdvice(false); // Hide advice before updating
                setTimeout(() => {
                    setShowAdvice(true); // Show advice after a delay
                }, 500); // Delay of 0.5 seconds
            } catch (error) {
                console.error('Error fetching advice:', error);
            }

            // Update image
            const canvas = canvasRef.current;
            const logMonitor = logMonitorRef.current;
            if (canvas && logMonitor) {
                const context = canvas.getContext('2d');
                if (context) {
                    // Set canvas dimensions to be a square with height equal to the width of the log-monitor
                    const size = logMonitor.clientWidth;
                    canvas.width = size;
                    canvas.height = size;

                    const image = new Image();
                    image.src = astronautsImage;
                    image.onload = () => {
                        const randomIndex = Math.floor(Math.random() * 12);
                        const sx = randomIndex * 200;
                        const sy = 0;
                        const sWidth = 200;
                        const sHeight = 200;
                        const dx = 0;
                        const dy = 0;
                        const dWidth = size;
                        const dHeight = size;
                        context.clearRect(0, 0, size, size);
                        context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                    };
                    image.onerror = (error) => {
                        console.error('Error loading image:', error);
                    };
                }
            }
        };

        const interval = setInterval(updateContent, 10000); // Update content every 10 seconds

        // Initial update
        updateContent();

        return () => clearInterval(interval);
    }, []);

    const getTimeInSecondsSinceYear1 = (date: Date) => {
        const startOfYear1 = new Date(Date.UTC(1, 0, 1));
        const diffInSeconds = Math.floor((date.getTime() - startOfYear1.getTime()) / 1000);
        return diffInSeconds;
    };

    return (
        <div className="right-panel panel">
            <h2>UTC Time: {getTimeInSecondsSinceYear1(utcTime)}</h2>
            <div className="log-monitor" ref={logMonitorRef}>
                {logMessage}
            </div>
            <div className="astronaut-log">
                <canvas ref={canvasRef} className="astronaut-canvas"></canvas>
                <div className={`astronaut-comment ${showAdvice ? 'show' : ''}`} style={{ width: logMonitorRef.current?.clientWidth }}>
                    {advice}
                </div>
            </div>
        </div>
    );
};

export default RightPanel;