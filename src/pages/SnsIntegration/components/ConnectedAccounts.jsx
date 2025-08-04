import { CheckCircle, Facebook, Instagram, XCircle, Youtube } from 'lucide-react';

export const ConnectedAccounts = ({ connectedAccounts, onConnect, onDisconnect }) => {
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram':
        return <Instagram size={20} className="text-pink-600" />;
      case 'facebook':
        return <Facebook size={20} className="text-blue-600" />;
      case 'youtube':
        return <Youtube size={20} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getPlatformName = (platform) => {
    switch (platform) {
      case 'instagram':
        return '인스타그램';
      case 'facebook':
        return '페이스북';
      case 'youtube':
        return '유튜브';
      default:
        return platform;
    }
  };

  return (
    <div className="lg:col-span-2">
      <h2 className="text-lg font-semibold mb-4">연동된 SNS 계정</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {connectedAccounts.map((account, index) => (
          <div key={index} className={`p-4 flex items-center justify-between ${index < connectedAccounts.length - 1 ? 'border-b border-gray-200' : ''}`}>
            <div className="flex items-center">
              {getPlatformIcon(account.platform)}
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  {getPlatformName(account.platform)}
                </div>
                <div className="text-sm text-gray-500">
                  {account.username}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {account.connected ? (
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span className="text-sm text-green-600 mr-4">연동됨</span>
                  <button
                    onClick={() => onDisconnect(account.platform)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    연결 해제
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <XCircle size={16} className="text-red-500 mr-2" />
                  <span className="text-sm text-red-600 mr-4">연동 안됨</span>
                  <button
                    onClick={() => onConnect(account.platform)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    연결하기
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 