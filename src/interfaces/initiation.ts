export type ManagementType = 'final-question' | 'keyword' | 'scope' | 'reflection-log' | null;

export interface TopicKeywordStyle {
    classes: string;
    icon: string;
    iconColor: string;
    secondaryText: string;
    actionIcon?: string; // Icon for the action button on the right
}
