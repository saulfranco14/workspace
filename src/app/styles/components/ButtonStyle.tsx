import styled from 'styled-components';

export const SubmitButton = styled.button`
  width: 100%;
  background-color: #1E8E3E;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #167a31;
  }
  &:disabled {
    background-color: #a5d8b4;
    cursor: not-allowed;
  }
`;
