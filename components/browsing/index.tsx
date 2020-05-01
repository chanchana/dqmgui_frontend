import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Select } from 'antd';

import { WrapperDiv } from '../../containers/display/styledComponents';
import { DatasetsBrowser } from './datasetsBrowsing/datasetsBrowser';
import { OptionalDatasetsBrowser } from './datasetsBrowsing/datasetNameBuilder';
import { QueryProps, OptionProps } from '../../containers/display/interfaces';
import { RunBrowser } from './runsBrowser';
import Form from 'antd/lib/form/Form';
import { dataSetSelections } from '../constants';
import { RadioButtonsGroup } from '../radioButtonsGroup';
import { StyledFormItem } from '../styledComponents';
import { StyledSelect } from '../viewDetailsMenu/styledComponents';
import { SelectValue } from 'antd/lib/select';
import { DropdownMenu } from '../menu';

const { Option } = Select;

export const Browser = () => {
  const router = useRouter();
  const query: QueryProps = router.query;

  const [datasetName, setDatasetName] = useState(query.dataset_name);
  const [run_number, setRunNumber] = useState(query.run_number);
  const [value, setValue] = useState();
  const [datasetOption, setDatasetOption] = useState(
    dataSetSelections[0].value
  );

  return (
    <Form>
      <WrapperDiv>
        <WrapperDiv>
          <RunBrowser
            value={value}
            run_number={run_number}
            setRunNumber={setRunNumber}
          />
        </WrapperDiv>
        <StyledFormItem
          label={
            <DropdownMenu
              options={dataSetSelections}
              action={setDatasetOption}
              defaultValue={dataSetSelections[0]}
            />
          }
        >
          {datasetOption === dataSetSelections[0].value ? (
            <WrapperDiv>
              <DatasetsBrowser
                datasetName={datasetName}
                setDatasetName={setDatasetName}
                setValue={setValue}
              />
            </WrapperDiv>
          ) : (
            <WrapperDiv>
              <OptionalDatasetsBrowser
                datasetName={datasetName}
                setDatasetName={setDatasetName}
                setValue={setValue}
              />
            </WrapperDiv>
          )}
        </StyledFormItem>
      </WrapperDiv>
    </Form>
  );
};
