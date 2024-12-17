import { NFTInfoCard } from './NFTInfoCard';
import { OPEInfoCard } from '../ope/OPEInfoCard';
import { ClaimConditionsCard } from '../angel/ClaimConditionsCard';
import { ReferralCard } from '../../common/cards/ReferralCard';

interface InfoSliderProps {
  address?: string;
}

export function InfoSlider({ address }: InfoSliderProps) {
  return (
    <div className="grid md:grid-cols-4 gap-8 mb-16">
      <NFTInfoCard tokenId="0" level={0} rarity={''} power={0} rewards={0}/>
      <OPEInfoCard />
      <ClaimConditionsCard />
      <ReferralCard />
    </div>
  );
} 