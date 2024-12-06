import React, { useEffect, useRef } from 'react';
import './BackgroundCanvas.css';
import marsImage from './mars.png';

let isInitPhase = true;

class Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  directionX: number;
  directionY: number;

  constructor(x: number, y: number, size: number, speed: number, directionX: number, directionY: number) {
    this.x = x;
    this.y = y;
    this.size = size + 0.00001;
    this.speed = speed + 0.00001;
    this.directionX = directionX;
    this.directionY = directionY;
  }

  update(simulatedSteps: number = 1) {
    this.x += (this.directionX * this.speed) * simulatedSteps;
    this.y += (this.directionY * this.speed) * simulatedSteps;
    this.speed += 0.000001 * simulatedSteps;
    this.size += 0.000001 * simulatedSteps;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
  }
}

const drawMarsOnMiniCanvas = (miniCanvas: HTMLCanvasElement) => {
  const context = miniCanvas.getContext('2d');
  if (context) {
    const mars = new Image();
    mars.src = marsImage;
    mars.onload = () => {
      const marsWidth = 100;
      const marsHeight = 100;
      const marsX = (miniCanvas.width - marsWidth) / 2;
      const marsY = (miniCanvas.height - marsHeight) / 2;
      context.clearRect(0, 0, miniCanvas.width, miniCanvas.height);
      context.drawImage(mars, marsX, marsY, marsWidth, marsHeight);
    };
  }
};

const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const miniCanvas = miniCanvasRef.current;

    if (canvas && miniCanvas) {
      const context = canvas.getContext('2d');

      const updateCanvasSize = () => {
        const miniCanvasSize = 100;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        miniCanvas.width = miniCanvasSize;
        miniCanvas.height = miniCanvasSize;
        miniCanvas.style.position = 'absolute';
        miniCanvas.style.left = `${(window.innerWidth - miniCanvas.width) / 2}px`;
        miniCanvas.style.top = `${(window.innerHeight - miniCanvas.height) / 2}px`;
        if (context) {
          context.fillStyle = 'rgb(25, 25, 25)';
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
      };

      const createStar = () => {
        const speed = Math.random() * 0.05 + 0.01;
        const directionX = Math.random() * 2 - 1;
        const directionY = Math.random() * 2 - 1;
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        starsRef.current.push(new Star(
          canvas.width / 2,
          canvas.height / 2,
          Math.random() * 1 + 0.5,
          speed,
          directionX / magnitude,
          directionY / magnitude
        ));
      };

      const createStarOnPageLoad = (iterations: number) => {
        for (let i = 0; i < iterations; i++) {
          createStar();
        }
      };

      const animateStars = () => {
        if (context) {
          context.fillStyle = 'rgb(25, 25, 25)';
          context.fillRect(0, 0, canvas.width, canvas.height);

          if (isInitPhase) {
            createStarOnPageLoad(500);
            starsRef.current.forEach((star, index) => {
              star.draw(context);
              star.update(index * 40);
            });
            isInitPhase = false;
          }

          starsRef.current.forEach((star, index) => {
            star.update();
            star.draw(context);
            if (star.x < 0 || star.x > canvas.width || star.y < 0 || star.y > canvas.height) {
              starsRef.current.splice(index, 1);
            }
          });

          drawMarsOnMiniCanvas(miniCanvas);

          requestAnimationFrame(animateStars);
        }
      };

      updateCanvasSize();
      setInterval(createStar, 400);
      animateStars();
      window.addEventListener('resize', updateCanvasSize);

      return () => {
        window.removeEventListener('resize', updateCanvasSize);
      };
    }
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="background-canvas"></canvas>
      <canvas ref={miniCanvasRef} className="mini-canvas"></canvas>
    </>
  );
};

export default BackgroundCanvas;