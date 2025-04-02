export interface DroppableCollectionProps {
  collectionId: string;
  name: string;
  itemCount: number;
  isActive: boolean;
  onSelect: () => void;
}
