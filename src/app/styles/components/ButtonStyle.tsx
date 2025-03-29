import styled from 'styled-components';

export const SubmitButton = styled.button`
  width: 100%;
  background-color: #007537;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
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
