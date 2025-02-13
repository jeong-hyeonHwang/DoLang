import { getNoteListPage } from '../services/noteService';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useNoteListQuery = (page: number) => {
  return useQuery({
    queryKey: ['notePageListData', page],
    queryFn: () => getNoteListPage(page),
    placeholderData: keepPreviousData,
  });
};
