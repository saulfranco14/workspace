import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f5f5f5;
`;

export const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FormSection = styled.div`
  flex: 1;
  padding: 3rem 2rem;
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

export const ImageSection = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  
  @media (max-width: 768px) {
    display: none;
  }
`; 