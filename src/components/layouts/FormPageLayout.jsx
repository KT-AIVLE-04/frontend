import React from 'react';
import { Card } from '../molecules';
import { ApiPageLayout } from './ApiPageLayout';

export const FormPageLayout = ({
  // ApiPageLayout props
  loading,
  error,
  topSection,
  loadingMessage,
  errorTitle,
  errorMessage,
  className,
  
  // 폼 관련
  onSubmit,
  children,
  
  // 폼 옵션
  formClassName = "space-y-6",
  cardClassName = "max-w-2xl mx-auto",
  
  // 버튼 영역
  submitButton,
  cancelButton,
  buttonArea,
  
  // 추가 props
  ...props
}) => {
  const renderButtonArea = () => {
    if (buttonArea) {
      return buttonArea;
    }

    if (submitButton || cancelButton) {
      return (
        <div className="flex justify-end gap-3 pt-6">
          {cancelButton}
          {submitButton}
        </div>
      );
    }

    return null;
  };

  return (
    <ApiPageLayout
      loading={loading}
      error={error}
      topSection={topSection}
      loadingMessage={loadingMessage}
      errorTitle={errorTitle}
      errorMessage={errorMessage}
      className={className}
      {...props}
    >
      <Card className={cardClassName}>
        <form onSubmit={onSubmit} className={formClassName}>
          {children}
          {renderButtonArea()}
        </form>
      </Card>
    </ApiPageLayout>
  );
};
