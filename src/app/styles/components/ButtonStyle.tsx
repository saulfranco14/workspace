import styled from 'styled-components';

export const SubmitButton = styled.button`
  width: 100%;
  background-color: #007537;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #00602e;
  }

  &:disabled {
    background-color: #88c5a1;
    cursor: not-allowed;
  }
`;

export const ButtonViewMore = styled.button`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
  color: #4b5563;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
`;
