import { NoteComponent } from '@/features/Note/components/NoteComponent';
import MainViewComponent from './MainView/MainViewComponent';
import { getPromptQuestion } from '@/features/Prompt/services/promptService';

const MainView = () => {
  return (
    <>
      <NoteComponent />
      <MainViewComponent />
      <button onClick={() => getPromptQuestion({ interestA: ['sports'], interestB: ['music'] })}>getTopic</button>
    </>
  );
};

export default MainView;
