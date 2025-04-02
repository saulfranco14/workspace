import styled from 'styled-components';

export const FavoriteStyles = {
  Container: styled.div`
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  `,
  Header: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
  `,
  AddButton: styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--primary-light);
    color: var(--primary);
    border: none;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #e6f7ff;
    }
  `,
  CreateForm: styled.div`
    padding: 1rem;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;

    input {
      width: 100%;
      padding: 0.625rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }
  `,
  CreateFormButtons: styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;

    button {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      border: none;
      font-size: 0.875rem;
    }

    .cancel {
      background-color: #f3f4f6;
      color: #4b5563;

      &:hover {
        background-color: #e5e7eb;
      }
    }

    .create {
      background-color: var(--primary);
      color: white;

      &:hover {
        background-color: var(--primary-dark);
      }

      &:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
      }
    }
  `,
  EmptyCollections: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    color: #6b7280;
    text-align: center;

    svg {
      margin-bottom: 1rem;
      color: #9ca3af;
    }

    p {
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }

    button {
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 0.375rem;
      padding: 0.625rem 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--primary-dark);
      }
    }
  `,
  CollectionsList: styled.div`
    max-height: 400px;
    overflow-y: auto;
  `,
  DeleteButton: styled.button`
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;

    &:hover {
      color: #ef4444;
    }
  `,
  ConfirmDelete: styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.95);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    padding: 40px;

    p {
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 0.75rem;
    }
  `,
  ConfirmButtons: styled.div`
    display: flex;
    gap: 0.5rem;

    button {
      padding: 0.375rem 0.75rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-size: 0.75rem;
    }

    .cancel {
      background-color: #f3f4f6;
      color: #4b5563;

      &:hover {
        background-color: #e5e7eb;
      }
    }

    .delete {
      background-color: #ef4444;
      color: white;

      &:hover {
        background-color: #dc2626;
      }
    }
  `,
  LoadingMessage: styled.div`
    padding: 2rem;
    text-align: center;
    color: #6b7280;
  `,
};
