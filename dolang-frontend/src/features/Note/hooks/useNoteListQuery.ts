import { getNoteList } from '../services/noteService';
import { useQuery } from '@tanstack/react-query';

export const useNoteListQuery = () => {
  return useQuery({
    queryKey: ['noteListData'],
    queryFn: getNoteList,
  });
};
