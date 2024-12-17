import { NFTInfoCard } from '../NFTInfoCard';
import { OPEInfoCard } from '../../ope/OPEInfoCard';
import { ClaimConditionsCard } from '../../angel/ClaimConditionsCard';
import { ReferralCard } from '../../../common/cards/ReferralCard';


export function InfoSlider() {
  return (
    <div className="grid md:grid-cols-4 gap-8 mb-16">
      <NFTInfoCard tokenId={''} level={0} rarity={''} power={0} rewards={0} />
      <OPEInfoCard />
      <ClaimConditionsCard />
      <ReferralCard />
    </div>
  );
} 