import { useState } from "react";
import { useActiveWallet } from "thirdweb/react";
import { motion } from "framer-motion";
import { FiEdit3, FiCopy } from 'react-icons/fi';
import { truncateAddress } from '@/utils/address';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Header } from '@/components/layout/Header';
import { TabBar } from '@/components/layout/TabBar';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export function ProfilePage() {
  const walletAddress = useActiveWallet() as unknown as string;
  const [isEditing, setIsEditing] = useState(false);

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success('Address copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-black">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-[72px] pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-purple-900/20 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-2 border-purple-500" />
                <div>
                  <h2 className="text-2xl font-bold">
                    {isEditing ? (
                      <input
                        type="text"
                        className="bg-black/50 border border-purple-500/50 rounded px-2 py-1"
                        placeholder="Enter nickname"
                      />
                    ) : (
                      "Unnamed"
                    )}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400">{truncateAddress(walletAddress)}</span>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1 hover:bg-purple-500/20 rounded transition-colors"
                      title="Copy Address"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <FiEdit3 className="w-4 h-4" />
                {isEditing ? 'Save' : 'Edit Profile'}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="nfts" className="space-y-6">
            <TabsList className="bg-purple-900/20 border border-purple-500/20">
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="nfts">
              <div className="bg-purple-900/20 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold mb-4">Your NFTs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* NFT Display Component */}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="bg-purple-900/20 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {/* Activity List */}
                  <p className="text-gray-400">No recent activity</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rewards">
              <div className="bg-purple-900/20 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold mb-4">Your Rewards</h3>
                <div className="space-y-4">
                  {/* Rewards Display */}
                  <p className="text-gray-400">No rewards yet</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <div className="bg-purple-900/20 rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
                  {/* Settings Form */}
                  <p className="text-gray-400">Coming soon</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <TabBar />
    </div>
  );
}

export default ProfilePage; 