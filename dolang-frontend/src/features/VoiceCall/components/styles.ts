import { css } from '@emotion/react';

export const styles = {
  voiceCallView: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background-color: #111;
    min-height: 100dvh;
  `,

  callParticipantsContainer: css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  `,

  callParticipant: css`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    color: #fff;
  `,

  userInfo: css`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
  `,
  userImage: css`
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
  `,

  countryFlag: css`
    font-size: 1.5rem;
  `,

  callTopicContainer: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  `,

  callTopicContent: css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: #d9d9d9;
    padding: 1rem;
    border-radius: 0.5rem;
    width: 100%;
    min-height: 5rem;
  `,

  callSttWrapper: css`
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 0.5rem;
    padding: 1rem;
    width: 100%;
    height: 100%;
  `,

  sttDivider: css`
    width: 100%;
    height: 1px;
    background-color: #d9d9d9;
  `,

  callTagsContainer: css`
    display: flex;
    flex-direction: row;
    background-color: #d9d9d9;
    padding: 1rem;
    gap: 1rem;
    border-radius: 1rem;
  `,

  callControlsContainer: css`
    background-color: #555b60;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 10rem;
    justify-content: space-around;
    gap: 1rem;
    padding: 1rem;
    border-radius: 1rem;
  `,

  endCallButton: css`
    background-color: #d36767;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    width: 4rem;
    height: 2rem;
    cursor: pointer;
  `,
};
