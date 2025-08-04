import { Pencil, Store, Trash2 } from 'lucide-react';
import { DataTable } from '../../../components';

export const StoreTable = ({ stores, handleDelete }) => {
  const columns = [
    {
      key: 'name',
      header: '매장명',
      render: (value, store) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Store size={18} className="text-blue-600" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {value}
            </div>
          </div>
        </div>
      )
    },
    { key: 'address', header: '주소' },
    { key: 'phone', header: '연락처' },
    { key: 'category', header: '업종' },
    {
      key: 'actions',
      header: '관리',
      align: 'right',
      render: (value, store) => (
        <div>
          <button className="text-blue-600 hover:text-blue-900 mr-3">
            <Pencil size={16} />
          </button>
          <button 
            onClick={() => handleDelete(store.id)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={stores}
      emptyMessage="등록된 매장이 없습니다"
    />
  );
}; 