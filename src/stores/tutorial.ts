import { create } from 'zustand';
import type { TutorialState, TutorialAction } from '@/types/tutorial';

interface StoreState extends TutorialState {
  dispatch: (action: TutorialAction) => void;
}

export const useTutorialStore = create<StoreState>((set) => ({
  currentModule: null,
  currentStep: 0,
  completedSteps: [],
  dispatch: (action: TutorialAction) => {
    switch (action.type) {
      case 'START_MODULE':
        set({ currentModule: action.moduleId });
        break;
      case 'COMPLETE_STEP':
        set(state => ({
          completedSteps: [...state.completedSteps, action.stepId]
        }));
        break;
      case 'SET_STEP':
        set({ currentStep: action.step });
        break;
      case 'RESET':
        set({
          currentModule: null,
          currentStep: 0,
          completedSteps: []
        });
        break;
    }
  }
})); 