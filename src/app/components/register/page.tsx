'use client';

import Image from 'next/image';

import RegisterForm from './RegisterForm';
import Navbar from '../navigation/Navbar';
import {
  PageContainer,
  ContentContainer,
  FormSection,
  ImageSection
} from '@/app/styles';

export default function RegisterPage() {
  return (
    <PageContainer>
      <ContentContainer>
        <Navbar />

        <FormSection>
          <RegisterForm />
        </FormSection>

        <ImageSection>
          <Image 
            src="/register/ilustration.svg" 
            alt="Planta decorativa" 
            layout="fill" 
            objectFit="cover" 
            priority 
          />
        </ImageSection>
      </ContentContainer>
    </PageContainer>
  );
}
