import { Check, Pencil, Store, Trash2 } from 'lucide-react';
import { DataTable, IconButton } from '../../../components';
import { Store as StoreModel } from '../../../models/Store';

export const StoreTable = ({ stores, handleDelete, handleEdit, handleSelect }) => {
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
            <div className="text-m font-bold text-gray-900">
              {value}
            </div>
          </div>
        </div>
      )
    },
    { key: 'address', header: '주소' },
    { key: 'phoneNumber', header: '연락처' },
    { 
      key: 'industry', 
      header: '업종',
      render: (value, store) => StoreModel.getIndustryLabel(store.industry)
    },
    { 
      key: 'businessNumber', 
      header: '사업자등록번호',
      render: (value, store) => {
        const hasBusinessNumber = store.businessNumber && store.businessNumber.trim() !== '';
        return hasBusinessNumber ? value : '-';
      }
    },
    {
      key: 'actions',
      header: '관리',
      render: (value, store) => (
        <div className="flex items-center justify-center space-x-3">
          <IconButton
            icon={Check}
            variant="success"
            size="medium"
            onClick={() => handleSelect(store)}
            title="선택"
          />
          <IconButton
            icon={Pencil}
            variant="primary"
            size="medium"
            onClick={() => handleEdit(store)}
            title="수정"
          />
          <IconButton
            icon={Trash2}
            variant="danger"
            size="medium"
            onClick={() => handleDelete(store.id)}
            title="삭제"
          />
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