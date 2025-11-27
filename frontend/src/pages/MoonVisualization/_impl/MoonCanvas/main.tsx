import { useEffect, useRef, useState } from 'react';
import { useMoonVisualizationStore, useMoonRotation } from '@/domain/moon-phase/_module';
import { formatDateForAPI, isDateInRange } from '@/domain/moon-phase/utils';
import { toast } from 'sonner';
import type { MoonCanvasProps } from './types';

function MoonCanvas({ moonData }: MoonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const dragAccumulatorRef = useRef(0);

  const {
    selectedDate,
    rotationAngle,
    rotationSpeed,
    setRotationAngle,
    setSelectedDate,
    setIsRotating,
  } = useMoonVisualizationStore();

  const { calculateDate } = useMoonRotation();

  // Draw moon on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !moonData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw moon sphere
    const gradient = ctx.createRadialGradient(
      centerX - radius * 0.3,
      centerY - radius * 0.3,
      radius * 0.1,
      centerX,
      centerY,
      radius
    );

    // Moon colors based on illumination
    const illumination = moonData.illumination / 100;
    gradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 + illumination * 0.1})`);
    gradient.addColorStop(0.7, `rgba(220, 220, 220, ${0.7 + illumination * 0.2})`);
    gradient.addColorStop(1, `rgba(150, 150, 150, ${0.5 + illumination * 0.3})`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw shadow for phase
    const shadowOffset = (1 - illumination) * radius * 2;
    const shadowX = centerX + shadowOffset - radius;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.arc(shadowX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillRect(0, 0, width, height);
  }, [moonData]);

  // Handle rotation calculation
  const handleRotationUpdate = async (newAngle: number) => {
    try {
      const normalizedAngle = ((newAngle % 360) + 360) % 360;
      setRotationAngle(normalizedAngle);

      const response = await calculateDate({
        baseDate: formatDateForAPI(selectedDate),
        angleDegrees: normalizedAngle,
        speed: rotationSpeed,
      });

      const newDate = new Date(response.date);

      if (!isDateInRange(newDate)) {
        toast.error('Limite temporal atingido', {
          description: 'Não é possível navegar além de ±50 anos.',
        });
        return;
      }

      setSelectedDate(newDate);
    } catch (error) {
      console.error('Error calculating rotation:', error);
      toast.error('Erro ao calcular rotação');
    }
  };

  // Mouse/Touch handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setIsRotating(true);
    dragAccumulatorRef.current = 0;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;

    const deltaX = clientX - startX;
    dragAccumulatorRef.current += deltaX;

    // Sensitivity: 30 degrees per 100px
    const degreesPerPixel = 30 / 100;
    const threshold = 100 / (rotationSpeed === 'slow' ? 1 : 7);

    if (Math.abs(dragAccumulatorRef.current) >= threshold) {
      const angleDelta = dragAccumulatorRef.current * degreesPerPixel;
      const newAngle = rotationAngle + angleDelta;
      handleRotationUpdate(newAngle);
      dragAccumulatorRef.current = 0;
    }

    setStartX(clientX);
  };

  const handleEnd = () => {
    setIsDragging(false);
    setIsRotating(false);
    dragAccumulatorRef.current = 0;
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    />
  );
}

export { MoonCanvas };
