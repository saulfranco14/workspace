import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: white;
  
  @media (max-width: 768px) {
    padding: 0;
    background-color: #f5f5f5;
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  background-color: white;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
    margin: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

export const FormSection = styled.div`
  flex: 1;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
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
  height: 70vh;
  
  @media (max-width: 768px) {
    height: auto;
    max-height: 350px;
    min-height: 300px;
    order: -1;
  }
`; 