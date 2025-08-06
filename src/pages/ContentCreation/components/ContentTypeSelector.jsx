import { Film, Image as ImageIcon, Sparkles } from 'lucide-react';

export const ContentTypeSelector = ({ contentType, setContentType }) => {
  const contentTypes = [
    {
      id: 'video',
      title: '숏폼 영상',
      description: '15-60초 길이의 숏폼 영상 생성',
      icon: <Film size={24} className="text-blue-600" />,
      color: 'blue'
    },
    {
      id: 'image',
      title: '이미지',
      description: 'SNS용 이미지 생성',
      icon: <ImageIcon size={24} className="text-green-600" />,
      color: 'green'
    },
    {
      id: 'post',
      title: '게시글',
      description: 'SNS용 게시글 텍스트 생성',
      icon: <Sparkles size={24} className="text-purple-600" />,
      color: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {contentTypes.map((type) => (
        <div
          key={type.id}
          onClick={() => setContentType(type.id)}
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
            contentType === type.id
              ? `border-${type.color}-500 bg-${type.color}-50`
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex justify-center mb-4">
            {type.icon}
            <h3 className="ml-3 text-lg font-semibold">{type.title}</h3>
          </div>
          <p className="text-gray-600">{type.description}</p>
        </div>
      ))}
    </div>
  );
}; 