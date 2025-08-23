# Atomic Design Component Library

이 프로젝트는 Atomic Design 패턴을 기반으로 구성된 React 컴포넌트 라이브러리입니다.

## 구조

### 🧪 Atoms (원자)
가장 기본적인 UI 요소들입니다. 더 이상 분해할 수 없는 최소 단위의 컴포넌트입니다.

- **Button**: 다양한 스타일과 크기의 버튼
- **IconButton**: 아이콘만 있는 버튼
- **Input**: 텍스트 입력 필드
- **Select**: 드롭다운 선택 필드
- **Textarea**: 다중 라인 텍스트 입력
- **Label**: 폼 라벨
- **Badge**: 상태나 카테고리를 표시하는 배지
- **Spinner**: 로딩 스피너
- **Icon**: 아이콘 래퍼

### 🧬 Molecules (분자)
Atoms를 조합하여 만든 단순한 컴포넌트들입니다.

- **FormField**: Input, Select, Textarea를 Label과 함께 조합
- **SearchField**: 검색 기능이 포함된 입력 필드
- **Card**: 기본 카드 컨테이너
- **Alert**: 알림 메시지 표시
- **Modal**: 모달 다이얼로그
- **Dropdown**: 드롭다운 메뉴
- **Tabs**: 탭 인터페이스
- **Pagination**: 페이지네이션

### 🦠 Organisms (유기체)
Molecules를 조합하여 만든 복잡한 컴포넌트들입니다.

- **Header**: 페이지 헤더
- **Sidebar**: 사이드 네비게이션
- **DataTable**: 데이터 테이블
- **ContentCard**: 콘텐츠 카드 (이미지, 제목, 액션 버튼 포함)
- **StatCard**: 통계 정보 카드
- **EmptyState**: 빈 상태 표시
- **LoadingSpinner**: 로딩 상태 표시
- **ErrorPage**: 에러 페이지
- **PageNavigation**: 페이지 네비게이션
- **ProgressBar**: 진행률 표시

## 사용법

### 기본 사용
```jsx
import { Button, FormField, Card } from '@components';

function MyComponent() {
  return (
    <Card>
      <FormField
        label="이름"
        name="name"
        type="text"
        placeholder="이름을 입력하세요"
      />
      <Button variant="primary" size="large">
        제출
      </Button>
    </Card>
  );
}
```

### Atoms 직접 사용
```jsx
import { Input, Label, Button } from '@components/atoms';

function CustomForm() {
  return (
    <div>
      <Label htmlFor="email" required>이메일</Label>
      <Input
        id="email"
        type="email"
        placeholder="이메일을 입력하세요"
      />
      <Button variant="success" fullWidth>
        가입하기
      </Button>
    </div>
  );
}
```

### Molecules 사용
```jsx
import { SearchField, Alert } from '@components/molecules';

function SearchPage() {
  return (
    <div>
      <SearchField
        placeholder="검색어를 입력하세요"
        onSearch={(term) => console.log(term)}
      />
      <Alert
        type="success"
        title="성공!"
        message="검색이 완료되었습니다."
      />
    </div>
  );
}
```

## 컴포넌트 Props

### Button
- `variant`: "primary" | "secondary" | "outline" | "danger" | "success" | "ghost"
- `size`: "small" | "medium" | "large"
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `icon`: Lucide React 아이콘 컴포넌트

### FormField
- `type`: "text" | "email" | "password" | "select" | "textarea"
- `label`: string
- `required`: boolean
- `error`: string
- `options`: Array (select 타입일 때)

### Card
- `variant`: "default" | "hover" | "interactive"
- `onClick`: function
- `hover`: boolean

### Alert
- `type`: "info" | "success" | "warning" | "error"
- `title`: string
- `message`: string
- `onClose`: function

## 스타일 가이드

모든 컴포넌트는 Tailwind CSS를 사용하며, 일관된 디자인 시스템을 따릅니다:

- **색상**: Blue, Gray, Red, Green, Yellow 계열
- **간격**: 4px 단위 (0.25rem)
- **둥근 모서리**: 8px (0.5rem), 16px (1rem)
- **그림자**: 커스텀 그림자 시스템
- **폰트**: Bold, Medium, Regular 가중치

## 확장하기

새로운 컴포넌트를 추가할 때는 다음 규칙을 따르세요:

1. **Atoms**: 재사용 가능한 최소 단위
2. **Molecules**: 2-3개의 Atoms 조합
3. **Organisms**: 복잡한 기능을 가진 컴포넌트

각 컴포넌트는 TypeScript props 인터페이스를 정의하고, 적절한 기본값을 설정하세요.
