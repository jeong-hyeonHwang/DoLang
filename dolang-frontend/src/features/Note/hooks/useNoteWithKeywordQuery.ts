import { getNoteListWithKeyword } from '../services/noteService';
import { useQuery } from '@tanstack/react-query';

export const useNoteWithKeywordQuery = (keyword: string) => {
  return useQuery({
    queryKey: ['noteWithKeywordData', keyword],
    queryFn: () => getNoteListWithKeyword(keyword),
  });
};
