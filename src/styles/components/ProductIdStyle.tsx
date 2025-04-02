import styled from 'styled-components';

export const ProductIdStyles = {
  BackLink: styled.a`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary);
    text-decoration: none;
    margin-bottom: 1.5rem;
    font-weight: 500;
    transition: color 0.2s;
    cursor: pointer;

    &:hover {
      color: var(--primary-dark);
    }
  `,

  ProductContainer: styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 3rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  `,

  ImageSection: styled.div`
    position: relative;
    height: 350px;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #f9f9f9;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

    @media (min-width: 768px) {
      height: 500px;
    }
  `,

  PlaceholderImage: styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
  `,

  InfoSection: styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `,

  CategoryBadge: styled.span`
    display: inline-block;
    background-color: var(--primary-light);
    color: var(--primary);
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;

    a {
      color: inherit;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  `,

  ProductName: styled.h1`
    font-size: 1.75rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 2rem;
    }
  `,

  PriceContainer: styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  `,

  Price: styled.span`
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary);
  `,

  StockBadge: styled.div<{ stock: number }>`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: ${({ stock }) => (stock > 10 ? '#e8f5e9' : stock > 0 ? '#fff8e1' : '#ffebee')};
    color: ${({ stock }) => (stock > 10 ? '#388e3c' : stock > 0 ? '#ff8f00' : '#d32f2f')};
  `,

  DescriptionContainer: styled.div`
    margin: 0.5rem 0;
  `,

  Description: styled.p<{ $expanded: boolean }>`
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
    overflow: hidden;
    max-height: ${(props) => (props.$expanded ? 'none' : '4.8em')};
    position: relative;
  `,

  DescriptionToggle: styled.button`
    background: none;
    border: none;
    color: var(--primary);
    font-weight: 500;
    padding: 0.5rem 0;
    cursor: pointer;
    font-size: 0.875rem;

    &:hover {
      text-decoration: underline;
    }
  `,

  ActionsContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.5rem;

    @media (min-width: 768px) {
      align-items: center;
    }
  `,

  ActionButtonGroup: styled.div`
    display: flex;
    gap: 0.5rem;
    width: 100%;
  `,

  ActionButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background-color: white;
    color: #4b5563;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;

    &:hover {
      background-color: #f9fafb;
      border-color: #d1d5db;
    }

    .action-text {
      display: none;
    }

    @media (min-width: 768px) {
      padding: 0.75rem 1rem;

      .action-text {
        display: inline;
      }
    }
  `,

  DeliveryInfo: styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #4b5563;
    margin-top: 0.5rem;
  `,

  RelatedProductsSection: styled.section`
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
  `,

  SectionTitle: styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1.5rem 0;
  `,

  RelatedProductsGrid: styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
  `,
};
