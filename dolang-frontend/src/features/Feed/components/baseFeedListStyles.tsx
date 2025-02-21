import { css } from '@emotion/react';

export const feedListContainerBase = css`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 50vh;
  border-radius: 0.6rem;
  overflow-y: scroll;
`;

export const feedListVariants = {
  default: css`
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1) inset;
  `,
  main: css`
    background-color: #f9f9f9;
  `,
};
