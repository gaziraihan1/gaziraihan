export type UsesSkill = {
    id: string;
    name: string;
    category: string;
    icon?: string | null;
    proficiency: number;
    order: number;
}

export type UsesHardware = {
    id: string;
    name: string;
    category: string;
    description?: string | null;
    imageUrl?: string | null;
    purchaseUrl?: string | null;
    isFavorite: boolean;
    price?: string | null
    order: number;
}

export type UsesSoftware = {
    id: string;
    name: string;
    category: string;
    description?: string | null;
    websiteUrl?: string | null;
    isPaid: boolean;
    isFavorite: boolean;
    order: number;
}

export type UseWorkflowItem = {
    title: string;
    description: string;
    url: string
}

export type UsesLearningItem = {
    name: string;
    description: string;
    url: string
}