import { useState, useEffect, useCallback } from 'react';
import { useContract } from 'thirdweb/react';
import { toast } from 'react-hot-toast';

interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

const defaultConfig: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1秒
  maxDelay: 10000,    // 10秒
  backoffFactor: 2    // 指数退避因子
};

export function useContractRetry(
  contractAddress: string, 
  config: RetryConfig = {}
) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  // 合并配置
  const finalConfig = { ...defaultConfig, ...config };
  const { maxRetries, initialDelay, maxDelay, backoffFactor } = finalConfig;

  // 使用 thirdweb 的 useContract
  const { contract, error: contractError } = useContract(contractAddress);

  // 计算下一次重试的延迟时间
  const getRetryDelay = useCallback((attempt: number) => {
    if (!initialDelay || !maxDelay) return 0; // 确保initialDelay和maxDelay不为undefined
    const delay = initialDelay * Math.pow(backoffFactor, attempt);
    return Math.min(delay, maxDelay);
  }, [initialDelay, maxDelay, backoffFactor]);

  // 重试逻辑
  useEffect(() => {
    if (!contractError || retryCount >= maxRetries) return;

    setIsRetrying(true);
    setLastError(contractError);

    const delay = getRetryDelay(retryCount);
    console.log(`Retrying contract connection (${retryCount + 1}/${maxRetries}) in ${delay}ms...`);

    const timer = setTimeout(() => {
      setRetryCount(prev => prev + 1);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsRetrying(false);
    };
  }, [contractError, retryCount, maxRetries, getRetryDelay]);

  // 重置重试状态
  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
    setLastError(null);
  }, []);

  // 当达到最大重试次数时显示错误提示
  useEffect(() => {
    if (retryCount >= maxRetries && lastError) {
      toast.error('Failed to connect to contract. Please try again later.');
      console.error('Contract connection failed after max retries:', lastError);
    }
  }, [retryCount, maxRetries, lastError]);

  return {
    contract,
    error: lastError,
    isRetrying,
    retryCount,
    hasReachedMaxRetries: retryCount >= maxRetries,
    reset,
    // 包装后的合约调用方法
    callWithRetry: async <T>(
      method: string,
      args: any[] = [],
      options: { onSuccess?: (data: T) => void; onError?: (error: Error) => void } = {}
    ) => {
      try {
        if (!contract) throw new Error('Contract not initialized');
        
        const result = await contract[method](...args);
        options.onSuccess?.(result);
        return result;
      } catch (error) {
        console.error(`Error calling ${method}:`, error);
        options.onError?.(error as Error);
        throw error;
      }
    }
  };
}

// 使用示例：
/*
const MyComponent = () => {
  const {
    contract,
    error,
    isRetrying,
    retryCount,
    hasReachedMaxRetries,
    callWithRetry
  } = useContractRetry(CONTRACT_ADDRESS, {
    maxRetries: 5,
    initialDelay: 2000
  });

  const handleMint = async () => {
    try {
      await callWithRetry('mint', [1], {
        onSuccess: (data) => {
          toast.success('NFT minted successfully!');
        },
        onError: (error) => {
          toast.error('Failed to mint NFT');
        }
      });
    } catch (error) {
      console.error('Mint error:', error);
    }
  };

  if (isRetrying) {
    return <div>Retrying connection... ({retryCount})</div>;
  }

  if (hasReachedMaxRetries) {
    return <div>Failed to connect after multiple attempts</div>;
  }

  return (
    <button onClick={handleMint} disabled={!contract}>
      Mint NFT
    </button>
  );
};
*/ 