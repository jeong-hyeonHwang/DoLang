import { useQuery } from '@tanstack/react-query';
import { getPromptQuestion } from '../services/promptService';

export const useQuestionPrompt = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['questionPrompt'],
    queryFn: () => getPromptQuestion({ interestA: [], interestB: [] }),
  });

  return { data, isLoading, error };
};
