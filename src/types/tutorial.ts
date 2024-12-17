export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  action?: () => Promise<void>;
  actionLabel?: string;
  highlightElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  required?: boolean;
  videoUrl?: string;
}

export interface TutorialModule {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  completedSteps: string[];
}

export interface TutorialProgress {
  current_module: string;
  wallet_address: string;
  current_step: number;
  completed_steps: string[];
  updated_at: string;
}

export interface TutorialState {
  currentModule: string | null;
  currentStep: number;
  completedSteps: string[];
  dispatch: (action: TutorialAction) => void;
}

export type TutorialAction = 
  | { type: 'START_MODULE'; moduleId: string }
  | { type: 'COMPLETE_STEP'; stepId: string }
  | { type: 'SET_STEP'; step: number }
  | { type: 'RESET' }; 

export interface TutorialHighlight {
  selector: string;
  message: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}