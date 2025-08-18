import React from 'react';
import { Container } from '../../../../components/Container';
import { ShortformGenerationProvider, useShortformGeneration } from '../../context/ShortformGenerationContext';
import { InformationInput } from './InformationInput';
import { ScenarioSelection } from './ScenarioSelection';
import { ShortsGeneration } from './ShortsGeneration';

const ShortsWorkflowContent = ({ setContentType }) => {
  const { activeStep } = useShortformGeneration();

  return (
    <Container className="overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className={`flex items-center ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <span className="text-sm font-medium">1</span>
            </div>
            <span className="ml-2 text-sm font-medium">정보 입력</span>
          </div>
          <div className={`w-12 h-0.5 mx-2 ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <span className="text-sm font-medium">2</span>
            </div>
            <span className="ml-2 text-sm font-medium">시나리오 선택</span>
          </div>
          <div className={`w-12 h-0.5 mx-2 ${activeStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${activeStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <span className="text-sm font-medium">3</span>
            </div>
            <span className="ml-2 text-sm font-medium">콘텐츠 생성</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeStep === 1 && <InformationInput />}
        {activeStep === 2 && <ScenarioSelection />}
        {activeStep === 3 && <ShortsGeneration setContentType={setContentType} />}
      </div>
    </Container>
  );
};

export const ShortsWorkflow = ({ setContentType }) => {
  return (
    <ShortformGenerationProvider>
      <ShortsWorkflowContent setContentType={setContentType} />
    </ShortformGenerationProvider>
  );
};