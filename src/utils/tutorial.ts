import { supabase } from '@/lib/supabase';
import { TutorialProgress, TutorialModule } from '@/types/tutorial';

export const tutorialUtils = {
  // 获取教学进度
  getTutorialProgress: async (address: string): Promise<TutorialProgress> => {
    try {
      const { data, error } = await supabase
        .from('tutorial_progress')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .single();

      if (error) throw error;
      return data as TutorialProgress;
    } catch (error) {
      console.error('Error getting tutorial progress:', error);
      throw error;
    }
  },

  // 更新教学进度
  updateTutorialProgress: async (
    address: string,
    moduleId: string,
    step: number,
    completedSteps: string[]
  ): Promise<TutorialProgress> => {
    try {
      const { data, error } = await supabase
        .from('tutorial_progress')
        .upsert({
          wallet_address: address.toLowerCase(),
          current_module: moduleId,
          current_step: step,
          completed_steps: completedSteps,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data as TutorialProgress;
    } catch (error) {
      console.error('Error updating tutorial progress:', error);
      throw error;
    }
  },

  // 重置教学进度
  resetTutorialProgress: async (address: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tutorial_progress')
        .delete()
        .eq('wallet_address', address.toLowerCase());

      if (error) throw error;
    } catch (error) {
      console.error('Error resetting tutorial progress:', error);
      throw error;
    }
  },

  // 模拟教学动作
  simulateTutorialAction: async (
    step: number,
    params?: Record<string, any>
  ): Promise<any> => {
    try {
      const { data, error } = await supabase
        .rpc('simulate_tutorial', {
          step,
          ...params
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error simulating tutorial action:', error);
      throw error;
    }
  },

  // 获取教学模块
  getTutorialModules: async (): Promise<TutorialModule[]> => {
    try {
      const { data, error } = await supabase
        .from('tutorial_modules')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      return data as TutorialModule[];
    } catch (error) {
      console.error('Error getting tutorial modules:', error);
      throw error;
    }
  }
}; 