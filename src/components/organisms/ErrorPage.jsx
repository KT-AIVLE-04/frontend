import { RefreshCw } from 'lucide-react';
import React from 'react';
import { Button } from '../atoms';
import { Alert } from '../molecules';

export function ErrorPage({ 
  title = "오류가 발생했습니다", 
  message = "페이지를 불러오는 중 문제가 발생했습니다.",
  onRetry,
  className = ""
}) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${className}`}>
      <div className="max-w-md w-full">
        <Alert
          type="error"
          title={title}
          message={message}
          showIcon={true}
          className="mb-6"
        />
        
        {onRetry && (
          <div className="flex justify-center">
            <Button
              variant="primary"
              icon={RefreshCw}
              onClick={onRetry}
            >
              다시 시도
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
