import { create } from 'zustand';

interface MoonVisualizationStore {
  selectedDate: Date;
  rotationSpeed: 'slow' | 'fast';
  rotationAngle: number;
  isRotating: boolean;
  dateArcInterval: 1 | 3 | 7 | 30;

  setSelectedDate: (date: Date) => void;
  setRotationSpeed: (speed: 'slow' | 'fast') => void;
  setRotationAngle: (angle: number) => void;
  setIsRotating: (isRotating: boolean) => void;
  setDateArcInterval: (interval: 1 | 3 | 7 | 30) => void;
  resetToToday: () => void;
}

export const useMoonVisualizationStore = create<MoonVisualizationStore>((set) => ({
  selectedDate: new Date(),
  rotationSpeed: 'slow',
  rotationAngle: 0,
  isRotating: false,
  dateArcInterval: 7,

  setSelectedDate: (date) => set({ selectedDate: date }),
  setRotationSpeed: (speed) => set({ rotationSpeed: speed }),
  setRotationAngle: (angle) => set({ rotationAngle: angle }),
  setIsRotating: (isRotating) => set({ isRotating }),
  setDateArcInterval: (interval) => set({ dateArcInterval: interval }),
  resetToToday: () =>
    set({
      selectedDate: new Date(),
      rotationAngle: 0,
    }),
}));
