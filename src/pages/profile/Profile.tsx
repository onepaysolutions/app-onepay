import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveWallet } from 'thirdweb/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CardContainer } from "@/components/ui/card-container";
import { Container } from "@/components/layout/Container";

export function Profile() {
  const { t } = useTranslation();
  const account = useActiveWallet();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        // 加载用户数据...
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (account) {
      loadProfile();
    }
  }, [account]);

  if (!account) {
    return (
      <Container>
        <div className="text-center py-8">
          <p className="text-gray-400">{t("请连接钱包")}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        <Tabs defaultValue="nfts" className="space-y-6">
          <TabsList className="bg-purple-900/20 border border-purple-500/20">
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="nfts">
            <CardContainer>
              <h3 className="text-lg font-semibold mb-4"> NFTs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* NFT Display Component */}
              </div>
            </CardContainer>
          </TabsContent>

          <TabsContent value="activity">
            <CardContainer>
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <p className="text-gray-400">No recent activity</p>
              </div>
            </CardContainer>
          </TabsContent>

          <TabsContent value="rewards">
            <CardContainer>
              <h3 className="text-lg font-semibold mb-4">Rewards</h3>
              <div className="space-y-4">
                <p className="text-gray-400">No rewards</p>
              </div>
            </CardContainer>
          </TabsContent>

          <TabsContent value="settings">
            <CardContainer>
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <p className="text-gray-400">Coming soon</p>
            </CardContainer>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
} 