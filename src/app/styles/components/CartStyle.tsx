import styled from 'styled-components';

export const CartStyle = {
  Button: styled.button`
    background: none;
    border: none;
    position: relative;
    font-size: 24px;
    color: #4caf50;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    transition: all 0.2s ease;

    &:hover {
      color: #388e3c;
    }
  `,

  Badge: styled.span`
    position: absolute;
    top: 0;
    right: 0;
    background-color: #f44336;
    color: white;
    font-size: 10px;
    font-weight: bold;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  ButtonContainer: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    max-width: 200px;

    &:hover {
      background-color: #388e3c;
    }

    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    svg {
      font-size: 18px;
    }
  `,

  ItemsList: styled.div`
    flex: 1;
    margin-bottom: 20px;
  `,

  ClearButton: styled.button`
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    color: #f44336;
    font-size: 14px;
    padding: 5px 0;
    margin-bottom: 15px;

    &:hover {
      text-decoration: underline;
    }
  `,

  TotalContainer: styled.div`
    margin-bottom: 20px;
    > div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
      color: #666;
    }
  `,

  TotalRow: styled.div`
    font-size: 18px !important;
    color: #000 !important;
    font-weight: 500;
    padding-top: 10px;
    border-top: 1px dashed #eee;
  `,

  ButtonsContainer: styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
  `,

  ContinueButton: styled.button`
    padding: 12px;
    border: 1px solid #4caf50;
    background-color: white;
    color: #4caf50;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f5f5f5;
    }
  `,

  CheckoutButton: styled.button`
    padding: 12px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background-color: #388e3c;
    }
  `,

  CartSummary: styled.div`
    border-top: 1px solid #eee;
    padding-top: 20px;
  `,

  Overlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
  `,

  DrawerContainer: styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    right: ${({ isOpen }) => (isOpen ? '0' : '-400px')};
    width: 100%;
    max-width: 400px;
    height: 100vh;
    background-color: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    z-index: 999;
    display: flex;
    flex-direction: column;

    @media (max-width: 480px) {
      max-width: 100%;
    }
  `,

  DrawerHeader: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;

    h3 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 18px;
    }

    svg {
      color: #4caf50;
    }
  `,

  CloseButton: styled.button`
    background: none;
    border: none;
    font-size: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;

    &:hover {
      color: #333;
    }
  `,

  DrawerContent: styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
  `,

  EmptyCart: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
    text-align: center;
    color: #666;

    svg {
      margin-bottom: 20px;
      color: #ccc;
    }

    p {
      margin-bottom: 20px;
      font-size: 16px;
    }

    button {
      background-color: #4caf50;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;

      &:hover {
        background-color: #388e3c;
      }
    }
  `,

  ItemContainer: styled.div`
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
  `,

  ImageContainer: styled.div`
    width: 70px;
    height: 70px;
    margin-right: 15px;
    border-radius: 4px;
    overflow: hidden;
    background-color: #f5f5f5;
  `,

  PlaceholderImage: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    font-size: 12px;
    text-align: center;
  `,

  ItemDetails: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
  `,

  ItemName: styled.h4`
    margin: 0 0 5px;
    font-size: 16px;
    font-weight: 500;
  `,

  ItemPrice: styled.div`
    font-weight: 500;
    color: #4caf50;
    margin-bottom: 10px;
  `,

  QuantityContainer: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,

  QuantityControls: styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #eee;
    border-radius: 4px;
  `,

  QuantityButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    width: 30px;
    height: 30px;
    cursor: pointer;
    color: #666;

    &:disabled {
      color: #ccc;
      cursor: not-allowed;
    }
  `,

  QuantityValue: styled.span`
    width: 30px;
    text-align: center;
    font-size: 14px;
  `,

  RemoveButton: styled.button`
    background: none;
    border: none;
    color: #f44336;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    padding: 4px;

    &:hover {
      background-color: #f5f5f5;
      border-radius: 50%;
    }
  `,
  ItemContainerItem: styled.div`
    display: grid;
    grid-template-columns: 100px 1fr auto auto auto;
    align-items: center;
    gap: 20px;
    padding: 20px 0;
    border-bottom: 1px solid #eee;

    @media (max-width: 768px) {
      grid-template-columns: 80px 1fr;
      gap: 15px;
    }
  `,

  ItemImage: styled.div`
    width: 100px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f5f5f5;

    @media (max-width: 768px) {
      width: 80px;
      height: 80px;
    }
  `,

  PlaceholderImageItem: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    font-size: 12px;
    text-align: center;
  `,

  ItemDetailsItem: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
      grid-column: 2;
    }
  `,

  ItemNameItem: styled.h3`
    font-size: 16px;
    margin: 0 0 5px;
    font-weight: 500;
  `,

  ItemPriceItem: styled.div`
    font-weight: 500;
    color: #4caf50;
    margin-bottom: 5px;
  `,

  StockInfo: styled.div`
    font-size: 13px;
    color: #888;
  `,

  QuantityContainerItem: styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;

    @media (max-width: 768px) {
      grid-column: 1/3;
      width: 120px;
    }
  `,

  QuantityButtonItem: styled.button`
    background: #f5f5f5;
    border: none;
    width: 32px;
    height: 32px;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:disabled {
      color: #ccc;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background: #ebebeb;
    }
  `,

  QuantityInput: styled.input`
    width: 40px;
    text-align: center;
    border: none;
    padding: 0;
    font-size: 14px;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `,

  SubtotalContainer: styled.div`
    @media (max-width: 768px) {
      grid-column: 2;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  `,

  SubtotalLabel: styled.div`
    font-size: 13px;
    color: #666;
    margin-bottom: 5px;

    @media (min-width: 769px) {
      display: none;
    }
  `,

  SubtotalAmount: styled.div`
    font-weight: 600;
    font-size: 16px;
  `,

  RemoveButtonItem: styled.button`
    background: none;
    border: none;
    color: #f44336;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 50%;

    &:hover {
      background-color: #ffebee;
    }

    @media (max-width: 768px) {
      grid-column: 1;
      grid-row: 3;
    }
  `,

  Container: styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;

    h1 {
      margin-bottom: 30px;
      font-size: 28px;
      font-weight: 600;
    }
  `,

  HeaderContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }
  `,

  ClearButtonPage: styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: #f44336;
    font-size: 14px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 4px;

    &:hover {
      background-color: #ffebee;
    }

    svg {
      font-size: 16px;
    }
  `,

  CartContainer: styled.div`
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 30px;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
    }
  `,

  CartItemsSection: styled.div`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 20px;
  `,

  CartSummarySection: styled.div`
    @media (max-width: 960px) {
      order: -1;
    }
  `,

  SummaryCard: styled.div`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 20px;
    position: sticky;
    top: 20px;

    h2 {
      font-size: 20px;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
  `,

  SummaryRow: styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-size: 15px;
    color: #666;
  `,

  SummaryTotal: styled.div`
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
    padding-top: 15px;
    border-top: 1px dashed #eee;
    font-size: 18px;
    font-weight: 500;
  `,

  CheckoutButtonPage: styled.button`
    width: 100%;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 15px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 15px;
    transition: all 0.2s ease;

    &:hover {
      background-color: #388e3c;
    }
  `,

  ContinueShoppingLink: styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #4caf50;
    font-size: 14px;
    text-decoration: none;
    width: 100%;
    text-align: center;

    &:hover {
      text-decoration: underline;
    }
  `,

  EmptyCartPage: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 0;
    color: #666;

    svg {
      color: #ccc;
      margin-bottom: 20px;
    }

    h2 {
      font-size: 24px;
      margin-bottom: 10px;
      font-weight: 500;
    }

    p {
      margin-bottom: 30px;
      max-width: 500px;
    }
  `,

  ContinueButtonPage: styled.a`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: #4caf50;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background-color: #388e3c;
    }
  `,
};
