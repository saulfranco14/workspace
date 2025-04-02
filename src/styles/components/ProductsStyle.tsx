import styled from 'styled-components';

export const ProductsStyle = {
  Header: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  `,

  Title: styled.h1`
    font-size: 2rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  `,

  MainContent: styled.div`
    display: grid;
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `,

  ProductsSection: styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
  `,
};
