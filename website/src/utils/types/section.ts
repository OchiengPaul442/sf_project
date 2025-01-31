export interface SectionProps {
  id: string;
  title: string;
  image?: string;
  onNextSection?: () => void;
  animationData?: any;
}

export interface AnimatedSectionProps extends SectionProps {
  isActive: boolean;
  index: number;
  currentSection: number;
  observerRef?: React.RefObject<HTMLElement>;
}

export interface StepWithData {
  id: string;
  title: string;
  animationData?: any;
}
