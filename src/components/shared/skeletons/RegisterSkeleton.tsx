'use client';

import { PageContainer, ContentContainer, FormSection, ImageSection } from '@/styles';

const RegisterSkeleton = () => {
  return (
    <PageContainer>
      <ContentContainer>
        <FormSection>
          <div className="flex flex-col gap-8 w-full animate-fadeIn">
            <div className="w-40 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="w-full h-12 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-40 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="w-full h-12 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-full h-12 bg-[#007537] rounded-md animate-pulse mt-6"></div>
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse mt-8"></div>
            <div className="w-48 h-4 bg-gray-200 rounded animate-pulse mt-4 mx-auto"></div>
          </div>
        </FormSection>

        <ImageSection>
          <div className="w-full h-[350px] lg:h-full bg-gray-200 bg-gradient-shimmer bg-[length:200%_100%] animate-shimmer rounded-none lg:rounded-3xl -order-1"></div>
        </ImageSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default RegisterSkeleton;
