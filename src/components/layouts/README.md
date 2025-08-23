# Layout Components

API 페이지에서 공통적으로 사용되는 레이아웃 컴포넌트들입니다.

## 📁 구조

```
src/components/layouts/
├── ApiPageLayout.jsx      # 기본 API 페이지 레이아웃
├── DataListLayout.jsx     # 데이터 목록 페이지 레이아웃
├── FormPageLayout.jsx     # 폼 페이지 레이아웃
└── index.js              # Export 파일
```

## 🎯 컴포넌트별 설명

### ApiPageLayout

기본적인 API 페이지 레이아웃을 제공합니다. 로딩, 에러, 빈 상태를 자동으로 처리합니다.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | `false` | 로딩 상태 |
| `error` | `string` | `null` | 에러 메시지 |
| `isEmpty` | `boolean` | `false` | 빈 상태 여부 |
| `children` | `ReactNode` | - | 메인 콘텐츠 |
| `topSection` | `ReactNode` | - | 상단 영역 (검색, 필터, 액션 등) |
| `emptyTitle` | `string` | "데이터가 없습니다" | 빈 상태 제목 |
| `emptyMessage` | `string` | "표시할 데이터가 없습니다." | 빈 상태 메시지 |
| `emptyAction` | `ReactNode` | - | 빈 상태 액션 버튼 |
| `loadingMessage` | `string` | "데이터를 불러오는 중..." | 로딩 메시지 |
| `errorTitle` | `string` | "오류가 발생했습니다" | 에러 제목 |
| `errorMessage` | `string` | - | 에러 메시지 (error prop과 동일) |

#### 사용 예제

```jsx
import { ApiPageLayout } from '../../components';

export function MyPage() {
  const { data, loading, error } = useApi(myApi.getData);

  return (
    <ApiPageLayout
      loading={loading}
      error={error}
      topSection={
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">내 페이지</h1>
            <Button>액션</Button>
          </div>
          <SearchFilter />
        </div>
      }
      isEmpty={data.length === 0}
      emptyTitle="데이터가 없습니다"
      emptyMessage="새로운 데이터를 추가해보세요"
      emptyAction={<Button>추가하기</Button>}
    >
      <div>메인 콘텐츠</div>
    </ApiPageLayout>
  );
}
```

### DataListLayout

데이터 목록을 표시하는 페이지에 특화된 레이아웃입니다. ApiPageLayout을 확장하여 그리드/리스트 레이아웃과 페이지네이션을 지원합니다.

#### Props

ApiPageLayout의 모든 props + 추가 props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array` | `[]` | 표시할 데이터 배열 |
| `renderItem` | `Function` | - | 개별 아이템 렌더링 함수 |
| `renderList` | `Function` | - | 전체 리스트 렌더링 함수 |
| `pagination` | `Object` | - | 페이지네이션 props |
| `showPagination` | `boolean` | `true` | 페이지네이션 표시 여부 |
| `gridClassName` | `string` | "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" | 그리드 클래스명 |
| `listClassName` | `string` | "space-y-4" | 리스트 클래스명 |
| `layoutType` | `"grid" \| "list"` | `"grid"` | 레이아웃 타입 |

#### 사용 예제

```jsx
import { DataListLayout } from '../../components';

export function StoreManagement() {
  const { data: stores, loading, error } = useApi(storeApi.getStores);

  return (
    <DataListLayout
      loading={loading}
      error={error}
      topSection={
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">매장 관리</h1>
          <Button>매장 추가</Button>
        </div>
      }
      data={stores}
      isEmpty={stores.length === 0}
      emptyTitle="등록된 매장이 없습니다"
      emptyMessage="새로운 매장을 추가해보세요"
      emptyAction={<Button>매장 추가하기</Button>}
      renderList={() => (
        <StoreTable stores={stores} />
      )}
      pagination={{
        currentPage: 1,
        totalPages: 10,
        onPageChange: handlePageChange
      }}
    />
  );
}
```

### FormPageLayout

폼 페이지에 특화된 레이아웃입니다. ApiPageLayout을 확장하여 폼 구조와 버튼 영역을 자동으로 처리합니다.

#### Props

ApiPageLayout의 모든 props + 추가 props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSubmit` | `Function` | - | 폼 제출 핸들러 |
| `submitButton` | `ReactNode` | - | 제출 버튼 |
| `cancelButton` | `ReactNode` | - | 취소 버튼 |
| `buttonArea` | `ReactNode` | - | 커스텀 버튼 영역 |
| `formClassName` | `string` | "space-y-6" | 폼 클래스명 |
| `cardClassName` | `string` | "max-w-2xl mx-auto" | 카드 클래스명 |

#### 사용 예제

```jsx
import { FormPageLayout, Button } from '../../components';

export function StoreUpdate() {
  const { loading, error } = useApi(storeApi.updateStore);

  return (
    <FormPageLayout
      loading={loading}
      error={error}
      topSection={
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">매장 정보 수정</h1>
          <Button variant="ghost">돌아가기</Button>
        </div>
      }
      onSubmit={handleSubmit}
      submitButton={
        <Button type="submit" loading={loading}>
          수정하기
        </Button>
      }
      cancelButton={
        <Button type="button" variant="outline" onClick={handleCancel}>
          취소
        </Button>
      }
    >
      <StoreForm {...formProps} />
    </FormPageLayout>
  );
}
```

## 🎨 스타일링

모든 레이아웃 컴포넌트는 Tailwind CSS를 사용하며, 필요에 따라 `className` prop을 통해 커스터마이징할 수 있습니다.

## 🔧 커스터마이징

### 테마 변경

```jsx
// 커스텀 스타일 적용
<DataListLayout
  className="custom-layout"
  gridClassName="custom-grid"
  containerClassName="custom-container"
/>
```

### 조건부 렌더링

```jsx
<ApiPageLayout
  showHeader={!isEmbedded}
  showSearchSection={hasSearch}
  headerActions={isAdmin ? adminActions : userActions}
/>
```

## 📝 사용 팁

1. **일관성 유지**: 모든 API 페이지에서 동일한 레이아웃 컴포넌트를 사용하여 일관된 UX 제공
2. **재사용성**: 공통 로직(로딩, 에러, 빈 상태)을 레이아웃에서 처리하여 코드 중복 방지
3. **유연성**: `renderList`, `renderItem` 등을 통해 다양한 데이터 표시 방식 지원
4. **접근성**: 기본적으로 접근성을 고려한 구조로 설계됨
