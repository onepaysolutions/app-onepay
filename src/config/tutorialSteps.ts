import { TutorialStep } from '@/types/tutorial';

export const TUTORIAL_KEYS = {
  common: {
    next: "tutorial.common.next",
    complete: "tutorial.common.complete",
    skip: "tutorial.common.skip",
    required: "tutorial.common.required",
    gotIt: "tutorial.common.gotIt"
  },
  starNFT: {
    intro: {
      title: "tutorial.starNFT.intro.title",
      description: "tutorial.starNFT.intro.description"
    }
  }
} as const;

export const starNFTSteps: TutorialStep[] = [
  {
    id: 'star-nft-intro',
    title: TUTORIAL_KEYS.starNFT.intro.title,
    description: TUTORIAL_KEYS.starNFT.intro.description,
    highlightElement: '#star-nft-header',
    position: 'bottom',
    actionLabel: TUTORIAL_KEYS.common.next
  },
  {
    id: 'star-nft-level',
    title: "tutorial.starNFT.level.title",
    description: "tutorial.starNFT.level.description",
    highlightElement: '#nft-level-selector',
    position: 'left',
    actionLabel: TUTORIAL_KEYS.common.next
  }
];

export const angelNFTSteps: TutorialStep[] = [
  {
    id: 'angel-nft-intro',
    title: "tutorial.angelNFT.intro.title",
    description: "tutorial.angelNFT.intro.description",
    highlightElement: '#angel-nft-header',
    position: 'bottom',
    actionLabel: TUTORIAL_KEYS.common.next
  },
  {
    id: 'angel-nft-claim',
    title: "tutorial.angelNFT.claim.title",
    description: "tutorial.angelNFT.claim.description",
    highlightElement: '#claim-button',
    position: 'bottom',
    actionLabel: TUTORIAL_KEYS.common.complete
  }
];

export const communitySteps: TutorialStep[] = [
  {
    id: 'community-intro',
    title: "tutorial.community.intro.title",
    description: "tutorial.community.intro.description",
    highlightElement: '#community-header',
    position: 'bottom',
    actionLabel: TUTORIAL_KEYS.common.next
  }
];

export const referralSteps: TutorialStep[] = [
  {
    id: 'referral-intro',
    title: "tutorial.referral.intro.title",
    description: "tutorial.referral.intro.description",
    highlightElement: '#referral-header',
    position: 'bottom',
    actionLabel: TUTORIAL_KEYS.common.next
  },
  {
    id: 'referral-link',
    title: "tutorial.referral.link.title",
    description: "tutorial.referral.link.description",
    highlightElement: '#referral-link',
    position: 'bottom',
    actionLabel: TUTORIAL_KEYS.common.next
  },
  {
    id: 'referral-zone',
    title: "tutorial.referral.zone.title",
    description: "tutorial.referral.zone.description",
    highlightElement: '#zone-selector',
    position: 'bottom',
    actionLabel: TUTORIAL_KEYS.common.complete
  }
]; 