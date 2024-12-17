import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export function useDBConnection() {
  const [isConnected, setIsConnected] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase
          .from('users')
          .select('id')
          .limit(1);

        if (error) {
          setIsConnected(false);
          toast.error(t('common.featureInDevelopment'));
        } else {
          setIsConnected(true);
        }
      } catch (error) {
        setIsConnected(false);
        toast.error(t('common.featureInDevelopment'));
      }
    };

    checkConnection();
  }, [t]);

  return isConnected;
} 