import { useQuery } from '@tanstack/react-query';
import { getPromptQuestion } from '../services/promptService';
import { PromptQuestionRequest } from '../types/Prompt.type';

export const useQuestionPrompt = ({ interestA, interestB }: PromptQuestionRequest) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['questionPrompt', interestA, interestB],
    queryFn: () => getPromptQuestion({ interestA, interestB }),
  });

  return { data, isLoading, error };
};
