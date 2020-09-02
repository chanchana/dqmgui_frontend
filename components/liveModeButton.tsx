import * as React from 'react';

import { LiveButton } from './styledComponents';
import Router from 'next/router';
import { useUpdateLiveMode } from '../hooks/useUpdateInLiveMode';

const liveModeHandler = (liveModeRun: string, liveModeDataset: string) => {
  Router.push({
    pathname: '/',
    query: {
      run_number: liveModeRun,
      dataset_name: liveModeDataset,
    },
  });
};

export const LiveModeButton = () => {
  const liveModeDataset = '/Global/Online/ALL';
  const liveModeRun = '0';
  const { set_update, update } = useUpdateLiveMode();

  return (
    <LiveButton
      onClick={() => {
        liveModeHandler(liveModeRun, liveModeDataset);
        () => set_update(true)
      }}
    >
      Live Mode
    </LiveButton>
  );
};