# Custom Hooks

이 디렉토리에는 프로젝트에서 재사용 가능한 커스텀 훅들이 정의되어 있습니다.

## useApi

API 호출을 위한 기본 훅입니다.

```javascript
const { data, loading, error, execute } = useApi(apiFunction);
```

## useForm

폼 상태 관리를 위한 훅입니다.

```javascript
const { values, errors, handleChange, handleSubmit, setValues, setErrors } = useForm(initialValues, validationSchema);
```

## useMultipleApi

여러 API를 동시에 호출하고 관리하는 훅입니다.

```javascript
const { 
  loading, 
  error, 
  errors,        // 개별 API 에러들
  results, 
  executeMultiple,    // 병렬 실행 (Promise.all) - 하나라도 실패하면 전체 실패
  executeAllSettled,  // 병렬 실행 (Promise.allSettled) - 모든 결과를 받음
  executeSequential,  // 순차 실행
  executeWithRetry,   // 재시도 로직 포함
  clearResults 
} = useMultipleApi();
```

### executeMultiple
- `Promise.all`을 사용하여 병렬 실행
- 하나라도 실패하면 전체가 실패로 처리
- 모든 API가 성공해야 결과를 받음

### executeAllSettled ⭐ (추천)
- `Promise.allSettled` 방식으로 모든 API 호출 결과를 받음
- 성공/실패를 구분해서 처리 가능
- 일부 API가 실패해도 다른 API의 결과는 받을 수 있음
- `errors` 객체로 개별 API 에러들을 확인 가능

```javascript
const result = await executeAllSettled({
  users: () => userApi.getUsers(),
  posts: () => postApi.getPosts(),
  comments: () => commentApi.getComments()
});

console.log('성공한 결과:', result.results);
console.log('실패한 API들:', result.errors);
```

### executeSequential
- API를 순차적으로 실행
- 하나가 실패해도 다음 API는 계속 실행

### executeWithRetry
- 재시도 로직이 포함된 병렬 실행
- 기본 3회 재시도, 지수 백오프 적용

## useLocalStorage

로컬 스토리지와 상태를 동기화하는 훅입니다.

```javascript
const [value, setValue] = useLocalStorage('key', defaultValue);
```

## useDebounce

입력값의 디바운싱을 위한 훅입니다.

```javascript
const debouncedValue = useDebounce(value, 500);
```

## useClickOutside

요소 외부 클릭을 감지하는 훅입니다.

```javascript
const ref = useClickOutside(() => {
  // 외부 클릭 시 실행할 로직
});
```

## usePagination

페이지네이션 상태를 관리하는 훅입니다.

```javascript
const { currentPage, totalPages, goToPage, nextPage, prevPage } = usePagination(totalItems, itemsPerPage);
```

## useSearch

검색 기능을 위한 훅입니다.

```javascript
const { searchTerm, setSearchTerm, filteredItems } = useSearch(items, searchKeys);
```

## useFileUpload

파일 업로드를 위한 훅입니다.

```javascript
const { uploading, uploadFile, progress } = useFileUpload();
```

## useNotification

알림을 표시하는 훅입니다.

```javascript
const { showNotification, hideNotification } = useNotification();
```

## useConfirm

확인 다이얼로그를 위한 훅입니다.

```javascript
const { showConfirm } = useConfirm();
```

## useWindowSize

윈도우 크기를 감지하는 훅입니다.

```javascript
const { width, height } = useWindowSize();
```
