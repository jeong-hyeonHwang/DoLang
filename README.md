## Commitlint
```bash
# 커밋린트 사용 시
# 초기 패키지 설치
npm i

# 패키지 설치 완료 후 커밋 시
npm run commit
```

## Library Usage

### Ant Design
https://ant.design/components/overview
```JavaScript
import { Button, DatePicker } from 'antd';

export default () => (
  <>
    <Button type="primary">PRESS ME</Button>
    <DatePicker placeholder="select date" />
  </>
);
```
