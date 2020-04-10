import React, { useEffect } from 'react';
import { Collapse, Switch } from 'antd';

import { Reference } from './reference/reference';
import { ViewFiler } from './viewFilter';
import { SizeChanger } from '../sizeChanger';
import { setJSROOTMode } from '../../reducers/displayFolderOrPlot';
import { setPlotToOverlay } from '../../reducers/displayFolderOrPlot'

const { Panel } = Collapse;

interface ViewDetailsMenuProps {
  dispatch: any;
  state: any;
  overlay_plot: any[];
}

export const ViewDetailsMenu = ({ dispatch, state }: ViewDetailsMenuProps) => {

  useEffect(() => {
    const clearOverlays = () => setPlotToOverlay([])(dispatch)
    return clearOverlays
  }, [])

  return (
    <>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Overlay Options" key="1">
          <Reference state_global={state} dispatch_gloabl={dispatch} />
        </Panel>
        <Panel header="Dispay Options" key="2">
          <div>
            <Switch
              checkedChildren="JSROOT enabled"
              unCheckedChildren="JSROOT disabled"
              onChange={(e) => {
                setJSROOTMode(e)(dispatch);
              }}
            />
          </div>
          <ViewFiler state={state} dispatch={dispatch} />
          <SizeChanger dispatch={dispatch} />
        </Panel>
      </Collapse>
    </>
  );
};
