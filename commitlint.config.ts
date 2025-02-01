import { RuleConfigCondition, RuleConfigSeverity, TargetCaseType } from '@commitlint/types';

export default {
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules: {
    'body-leading-blank': [RuleConfigSeverity.Warning, 'always'] as const,
    'body-max-line-length': [RuleConfigSeverity.Error, 'always', 100] as const,
    'footer-leading-blank': [RuleConfigSeverity.Warning, 'always'] as const,
    'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 100] as const,
    'header-max-length': [RuleConfigSeverity.Error, 'always', 100] as const,
    'header-trim': [RuleConfigSeverity.Error, 'always'] as const,
    'subject-case': [
      RuleConfigSeverity.Error,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ] as [RuleConfigSeverity, RuleConfigCondition, TargetCaseType[]],
    'subject-empty': [RuleConfigSeverity.Error, 'never'] as const,
    'subject-full-stop': [RuleConfigSeverity.Error, 'never', '.'] as const,
    'type-case': [RuleConfigSeverity.Error, 'always', 'lower-case'] as const,
    'type-empty': [RuleConfigSeverity.Error, 'never'] as const,
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
    ] as [RuleConfigSeverity, RuleConfigCondition, string[]],
  },
  prompt: {
    questions: {
      type: {
        description: '커밋하려는 변경 사항의 유형을 선택하세요',
        enum: {
          feat: {
            description: '새로운 기능 추가',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: '버그 수정',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: '문서만 변경',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: '코드의 의미에 영향을 주지 않는 변경 (공백, 서식, 세미콜론 누락 등)',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: '버그 수정이나 기능 추가가 아닌 코드 변경',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: '성능을 향상시키는 코드 변경',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: '누락된 테스트 추가 또는 기존 테스트 수정',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description: '빌드 시스템이나 외부 종속성에 영향을 주는 변경 (예: gulp, broccoli, npm)',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description: 'CI 구성 파일 및 스크립트 변경 (예: Travis, Circle, BrowserStack, SauceLabs)',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: '소스 코드나 테스트 파일을 수정하지 않는 기타 변경',
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: '이전 커밋 되돌리기',
            title: 'Reverts',
            emoji: '🗑',
          },
        },
      },
      scope: {
        description: 'What is the scope of this change (e.g. component or file name)',
      },
      subject: {
        description: 'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the change',
      },
      isBreaking: {
        description: 'Are there any breaking changes?',
      },
      breakingBody: {
        description: 'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
      },
      breaking: {
        description: 'Describe the breaking changes',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      issuesBody: {
        description:
          'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)',
      },
    },
  },
};
