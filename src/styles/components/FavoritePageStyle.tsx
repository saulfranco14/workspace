import styled from 'styled-components';

export const PageHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
`;

export const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 350px 1fr;
  }
`;

export const SidebarContainer = styled.div`
  @media (max-width: 767px) {
    order: 2;
  }
`;

export const MainContent = styled.div`
  @media (max-width: 767px) {
    order: 1;
  }
`;

export const CollectionHeader = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
`;

export const CollectionInfo = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const StyledProductGrid = styled.div<{ $isDragActive?: boolean }>`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  position: relative;
  min-height: 200px;
  border: ${(props) => (props.$isDragActive ? '2px dashed var(--primary)' : 'none')};
  border-radius: 0.5rem;
  padding: ${(props) => (props.$isDragActive ? '1rem' : '0')};
  background-color: ${(props) => (props.$isDragActive ? 'var(--primary-light)' : 'transparent')};
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
`;

export const DropOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.85);
  z-index: 10;
  color: var(--primary);

  svg {
    margin-bottom: 1rem;
    animation: pulse 1.5s infinite;
  }

  span {
    font-size: 1.125rem;
    font-weight: 500;
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
`;

export const LoadingMessage = styled.div`
  padding: 3rem;
  text-align: center;
  color: #6b7280;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const DuplicateErrorContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff8e1;
  border: 1px solid #ffcc80;
  color: #f57c00;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  max-width: 350px;
  animation: slideIn 0.3s ease-out;

  div {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }

  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #f57c00;
  cursor: pointer;
  padding: 4px;
  margin-left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(245, 124, 0, 0.1);
  }
`;
