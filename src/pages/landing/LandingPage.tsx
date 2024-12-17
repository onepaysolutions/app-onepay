import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveAccount } from 'thirdweb/react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarNFTService } from '@/services/starNFTService';
import { ConnectButton } from '@/components/auth/ConnectButton';

import { Spinner } from '@/components/ui/spinner';
import { Button } from '@headlessui/react';
import { Dialog } from '@headlessui/react';

export function LandingPage() {
  const navigate = useNavigate();
  const account = useActiveAccount();
  const [hasNFT, setHasNFT] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWeb3, setShowWeb3] = useState(false);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // 检查 NFT
  useEffect(() => {
    const checkNFT = async () => {
      if (!account?.address) return;
      
      try {
        const { data: balance } = await StarNFTService.useStarNFTBalance(account.address);
        setHasNFT(balance > 0);
        
        if (balance > 0) {
          // 有 NFT 直接进入主界面
          navigate('/dashboard');
        } else {
          // 没有 NFT 显示 Claim 弹窗
          setShowClaimDialog(true);
        }
      } catch (error) {
        console.error('Error checking NFT:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkNFT();
  }, [account]);

  // 处理 NFT Claim
  const handleClaimNFT = async () => {
    try {
      setIsClaiming(true);
      await StarNFTService.claimUserNFT();
      setHasNFT(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error claiming NFT:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black">
      <AnimatePresence>
        {!showWeb3 ? (
          // Web2 界面
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-20"
          >
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl font-bold text-center mb-8"
            >
              Welcome to the Future
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-center mb-12"
            >
              Experience the next generation of digital ownership
            </motion.p>
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setShowWeb3(true)}
              className="mx-auto block px-8 py-4 bg-purple-600 rounded-lg font-bold hover:bg-purple-700 transition-colors"
            >
              Start Journey
            </motion.button>
          </motion.div>
        ) : (
          // Web3 界面
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-20"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="max-w-md mx-auto bg-purple-900/20 p-8 rounded-2xl backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold text-center mb-8">
                Connect Your Wallet
              </h2>
              <ConnectButton />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Claim NFT 弹窗 */}
            <Dialog 
        open={showClaimDialog} 
        onClose={() => setShowClaimDialog(false)}
      >
        <Dialog.Panel className="sm:max-w-[425px]">
          <Dialog.Title>Welcome to Our Community!</Dialog.Title>
          <Dialog.Description>
            Claim your membership NFT to access exclusive features.
            </Dialog.Description>
          </Dialog.Panel>
          <div className="mt-6 space-y-4">
            <Button
              onClick={handleClaimNFT}
              className="w-full"
              disabled={isClaiming}
            >
              {isClaiming ? (
                <>
                  <Spinner />
                  Claiming...
                </>
              ) : (
                'Claim Your NFT'
              )}
            </Button>
          </div>
        </Dialog>
      </div>
    );
} 