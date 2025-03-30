import styled from 'styled-components';

export const AlertMessage = styled.div<{ type: 'error' | 'success' }>`
  background-color: ${props => props.type === 'error' ? '#ffebee' : '#e8f5e9'};
  color: ${props => props.type === 'error' ? '#c62828' : '#007537'};
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`; 