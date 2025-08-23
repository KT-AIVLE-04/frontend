# Custom Hooks Library

이 프로젝트에서 사용하는 커스텀 훅들의 모음입니다.

## 기본 훅들

### useAuth
인증 상태 관리를 위한 훅입니다.

### useApi
API 호출 상태 관리를 위한 훅입니다.
- `data`: API 응답 데이터
- `loading`: 로딩 상태
- `error`: 에러 상태
- `execute`: API 실행 함수
- `reset`: 상태 초기화

### useForm
폼 상태 관리를 위한 훅입니다.
- `values`: 폼 값들
- `errors`: 에러 상태
- `touched`: 터치된 필드들
- `handleChange`: 값 변경 핸들러
- `handleBlur`: 블러 핸들러
- `resetForm`: 폼 초기화

## 유틸리티 훅들

### useLocalStorage
로컬 스토리지 관리를 위한 훅입니다.

```jsx
const [value, setValue, removeValue] = useLocalStorage('key', initialValue);
```

### useDebounce
디바운스 기능을 위한 훅입니다.

```jsx
const debouncedValue = useDebounce(value, 500);
```

### useClickOutside
외부 클릭 감지를 위한 훅입니다.

```jsx
const ref = useClickOutside(() => {
  // 외부 클릭 시 실행할 로직
});
```

### useModal
모달 상태 관리를 위한 훅입니다.

```jsx
const { isOpen, open, close, toggle } = useModal();
```

### usePagination
페이지네이션 로직을 위한 훅입니다.

```jsx
const {
  currentPage,
  paginatedData,
  totalPages,
  goToPage,
  nextPage,
  prevPage,
  hasNextPage,
  hasPrevPage
} = usePagination(data, 10);
```

### useSearch
검색 및 필터링을 위한 훅입니다.

```jsx
const {
  searchTerm,
  filteredData,
  updateSearchTerm,
  updateFilter,
  clearAll
} = useSearch(data, ['title', 'content'], {
  debounceDelay: 300,
  caseSensitive: false
});
```

### useFileUpload
파일 업로드 관리를 위한 훅입니다.

```jsx
const {
  files,
  uploading,
  error,
  addFiles,
  removeFile,
  uploadFiles,
  formatFileSize
} = useFileUpload({
  maxFileSize: 10 * 1024 * 1024,
  allowedTypes: ['image/*', 'video/*'],
  multiple: true
});
```

### useNotification
알림 관리를 위한 훅입니다.

```jsx
const { success, error, warning, info } = useNotification();

// 사용 예시
success('성공적으로 저장되었습니다!');
error('오류가 발생했습니다.');
```

### useConfirm
확인 다이얼로그를 위한 훅입니다.

```jsx
const { confirm } = useConfirm();

const handleDelete = async () => {
  const confirmed = await confirm({
    title: '삭제 확인',
    message: '정말로 삭제하시겠습니까?'
  });
  
  if (confirmed) {
    // 삭제 로직
  }
};
```

### useWindowSize
윈도우 크기 감지를 위한 훅입니다.

```jsx
const { width, height, isMobile, isTablet, isDesktop } = useWindowSize();
```

## 사용 예시

### ContentManagement에서의 활용

```jsx
import { 
  useApi, 
  useSearch, 
  useFileUpload, 
  useConfirm, 
  useNotification 
} from '../../hooks';

export function ContentManagement() {
  // API 호출
  const { data, loading, execute: fetchContents } = useApi(contentApi.getContents);
  
  // 검색 및 필터링
  const { filteredData, updateSearchTerm } = useSearch(contents, ['title']);
  
  // 파일 업로드
  const { files, uploadFiles } = useFileUpload({
    maxFileSize: 100 * 1024 * 1024,
    allowedTypes: ['video/*', 'image/*']
  });
  
  // 확인 다이얼로그
  const { confirm } = useConfirm();
  
  // 알림
  const { success, error } = useNotification();
  
  // 삭제 핸들러
  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: '삭제 확인',
      message: '정말로 삭제하시겠습니까?'
    });
    
    if (confirmed) {
      try {
        await deleteContent(id);
        success('삭제되었습니다.');
      } catch (err) {
        error('삭제에 실패했습니다.');
      }
    }
  };
}
```

## 장점

1. **재사용성**: 공통 로직을 훅으로 분리하여 재사용 가능
2. **일관성**: 모든 컴포넌트에서 동일한 패턴 사용
3. **유지보수성**: 로직이 중앙화되어 관리 용이
4. **테스트 용이성**: 각 훅을 독립적으로 테스트 가능
5. **코드 간소화**: 컴포넌트 코드가 더 깔끔해짐
