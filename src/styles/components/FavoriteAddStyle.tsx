import styled from 'styled-components';

export const AddFavoriteStyle = {
  FavoriteButton: styled.button<{ $isActive: boolean; $size: 'sm' | 'md' | 'lg' }>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: ${(props) => (props.$size === 'sm' ? '0.375rem' : props.$size === 'md' ? '0.625rem' : '0.75rem')};
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background-color: ${(props) => (props.$isActive ? 'var(--primary-light)' : 'white')};
    color: ${(props) => (props.$isActive ? 'var(--primary)' : '#4b5563')};
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: ${(props) => (props.$isActive ? 'var(--primary-light)' : '#f9fafb')};
      border-color: ${(props) => (props.$isActive ? 'var(--primary-light)' : '#d1d5db')};
    }

    svg {
      font-size: ${(props) => (props.$size === 'sm' ? '1rem' : props.$size === 'md' ? '1.25rem' : '1.5rem')};
      stroke-width: ${(props) => (props.$isActive ? 2.5 : 2)};
      fill: ${(props) => (props.$isActive ? 'var(--primary)' : 'transparent')};
      color: ${(props) => (props.$isActive ? 'var(--primary)' : 'currentColor')};
    }

    .filled {
      fill: var(--primary);
    }
  `,

  CollectionSelectorOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `,

  CollectionSelectorModal: styled.div`
    background-color: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

    h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      color: #1f2937;
    }
  `,

  CollectionList: styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    max-height: 200px;
    overflow-y: auto;
  `,

  CollectionItem: styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background-color: #f9fafb;
    border: none;
    border-radius: 0.375rem;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f3f4f6;
    }
  `,

  CreateCollectionForm: styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;

    input {
      flex: 1;
      padding: 0.625rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }

    button {
      padding: 0.625rem 1rem;
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--primary-dark);
      }

      &:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
      }
    }
  `,
};
