import styled from 'styled-components';

export const DroppableCollectionStyles = {
  CollectionItem: styled.div<{ $isActive: boolean; $isDragActive: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.875rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    background-color: ${(props) => {
      if (props.$isDragActive) return 'var(--primary-light)';
      return props.$isActive ? 'var(--primary-light)' : 'transparent';
    }};
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
    border-left: ${(props) => (props.$isActive ? '4px solid var(--primary)' : '4px solid transparent')};
    box-shadow: ${(props) => (props.$isDragActive ? '0 0 0 2px var(--primary)' : 'none')};

    &:hover {
      background-color: ${(props) => {
        if (props.$isDragActive) return 'var(--primary-light)';
        return props.$isActive ? 'var(--primary-light)' : '#f9fafb';
      }};
    }

    &:last-child {
      border-bottom: none;
    }
  `,

  CollectionInfo: styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
  `,

  HeartIcon: styled.div<{ $isActive: boolean }>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      color: var(--primary);
      fill: ${(props) => (props.$isActive ? 'var(--primary)' : 'transparent')};
      stroke-width: ${(props) => (props.$isActive ? '2.5' : '2')};
      transition:
        fill 0.2s ease,
        stroke-width 0.2s ease;
    }
  `,

  CollectionName: styled.div`
    font-weight: 500;
    color: #1f2937;
  `,

  ItemCount: styled.div`
    font-size: 0.75rem;
    color: #6b7280;
  `,

  DropIndicator: styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary);
    font-size: 0.875rem;
    font-weight: 500;

    svg {
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `,
};
