import { RequestHandler } from 'express';
import { supabase } from '@/lib/supabase';

// 连接处理函数
export const connectionHandler: RequestHandler = async (req, res) => {
  try {
    const { record: user } = req.body;

    // 检查用户状态
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('status')
      .eq('id', user.id)
      .single();

    if (userError) {
      res.status(500).json({ error: userError.message });
      return;
    }

    if (existingUser?.status === 'BLOCKED') {
      res.status(403).json({ error: 'User is blocked' });
      return;
    }

    // 更新用户信息
    const { error: updateError } = await supabase
      .from('users')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) {
      res.status(500).json({ error: updateError.message });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Connection webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default connectionHandler; 