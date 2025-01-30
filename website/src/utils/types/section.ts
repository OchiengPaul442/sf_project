export interface SectionProps {
  id: string;
  title?: string;
  image?: string;
  animationData?: any;
}

export interface StepWithData extends SectionProps {
  steps?: any[];
}
