import { useQuery } from '@tanstack/react-query';
import { getPromptDateSentence } from '../services/promptService';

export const useSentencePrompt = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sentencePrompt'],
    queryFn: () => getPromptDateSentence(),
  });

  return { data, isLoading, error };
};
