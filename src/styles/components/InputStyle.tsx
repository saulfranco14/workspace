import styled from 'styled-components';

export const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const InputLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #666666;
  font-weight: 500;
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  color: #666666;
  
  &:focus {
    outline: none;
    border-color: #007537;
    box-shadow: 0 0 0 1px #007537;
  }
  
  &::placeholder {
    color: #aaa;
    opacity: 1;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
  
  &.error {
    border-color: #d32f2f;
  }
`;

export const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;