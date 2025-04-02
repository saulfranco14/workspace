import { ReactNode, FC } from 'react';

import { useClientReady } from '@/hooks/useClientReady';
import { PageContainer } from '@/styles';

type MainContainerProps = {
  children: ReactNode;
  isClient?: boolean;
};

const MainContainer: FC<MainContainerProps> = ({ children, isClient }) => {
  const clientReady = useClientReady();
  const viewClient = isClient !== undefined ? isClient : clientReady;

  return (
    <PageContainer className={`transition-opacity duration-500 ease-in ${viewClient ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </PageContainer>
  );
};

export default MainContainer;
