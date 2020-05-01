import React, { useState, useEffect } from 'react';
import { Col, Select, Row } from 'antd';
import { useRouter } from 'next/router';
import _ from 'lodash';
import Router from 'next/router';

import { QueryProps } from '../../../containers/display/interfaces';
import { useSearch } from '../../../hooks/useSearch';
import { getDatasetParts } from '../../viewDetailsMenu/utils';
import { PartsBrowser } from './partBrowser';
import {
  getRestOptions,
  getOneDatasetParts,
  getAvailableChoices,
} from '../utils';
import { StyledSuccessIcon, StyledErrorIcon } from '../../styledComponents';

interface DatasetsBrowserProps {
  setValue(value: any): void;
  datasetName: string | undefined;
  setDatasetName(name: string): void;
}

export const OptionalDatasetsBrowser = ({
  setValue,
  datasetName,
  setDatasetName,
}: DatasetsBrowserProps) => {
  const router = useRouter();
  const query: QueryProps = router.query;
  const selectedDatasetParts = getOneDatasetParts(datasetName);

  // groupBy- save the last selected dataset part (first, second or third). Group by is used for do
  // a grouping by last selected part of dataset. By default it set 'first'
  //setGroupBy set a groupBy variable value.
  const [groupBy, setGroupBy] = useState('first');
  const [name, setName] = useState(selectedDatasetParts.first);

  const [selectedParts, setSelectedParts] = useState({
    first: selectedDatasetParts.first,
    second: selectedDatasetParts.second,
    third: selectedDatasetParts.third,
  });

  const { results, results_grouped, searching, isLoading, error } = useSearch(
    query.run_number,
    ''
  );

  const datasets = results_grouped.map((result) => result.dataset);
  //grouping by last selected part of dataset
  const resultsNames: any = getDatasetParts(datasets, groupBy);

  //getAvailableChoices finds first part of dataset name, which exists by last selected part;
  //if the last selected part was the first one, it returns all possible forst choices
  const firstResultsNames: string[] = getAvailableChoices(
    resultsNames,
    name,
    'first'
  );
  //all existing first parts of dataset (from all available choices)
  const restFirstNames = getRestOptions(firstResultsNames, datasets, 'first');

  const secondResultsNames: string[] = getAvailableChoices(
    resultsNames,
    name,
    'second'
  );
  const restSecondNames = getRestOptions(
    secondResultsNames,
    datasets,
    'second'
  );

  const thirdResultsNames: string[] = getAvailableChoices(
    resultsNames,
    name,
    'third'
  );
  const restThirdNames = getRestOptions(thirdResultsNames, datasets, 'third');
  // we put the first item in array as empty string, because by default dataset name starts with slash
  const fullDatasetName = [
    '',
    selectedParts.first,
    selectedParts.second,
    selectedParts.third,
  ].join('/');
  const isThatDatasetExist = datasets.includes(fullDatasetName);

  useEffect(() => {
    if (isThatDatasetExist) {
      Router.replace({
        pathname: '/',
        query: {
          run_number: query.run_number,
          dataset_name: fullDatasetName,
          folder_path: query.folder_path,
          overlay: query.overlay,
          overlay_data: query.overlay_data,
          selected_plots: query.selected_plots,
        },
      });
    }
  }, [fullDatasetName]);

  return (
    <Row>
      <Col>
        <PartsBrowser
          restParts={restFirstNames}
          part="first"
          resultsNames={firstResultsNames}
          setGroupBy={setGroupBy}
          setName={setName}
          selectedName={name}
          name={selectedDatasetParts.first}
          setSelectedParts={setSelectedParts}
          selectedParts={selectedParts}
        />
      </Col>
      <Col>
        <PartsBrowser
          restParts={restSecondNames}
          part="second"
          resultsNames={secondResultsNames}
          setGroupBy={setGroupBy}
          setName={setName}
          selectedName={name}
          name={selectedDatasetParts.second}
          setSelectedParts={setSelectedParts}
          selectedParts={selectedParts}
        />
      </Col>
      <Col>
        <PartsBrowser
          restParts={restThirdNames}
          part="third"
          resultsNames={thirdResultsNames}
          setGroupBy={setGroupBy}
          setName={setName}
          selectedName={name}
          name={selectedDatasetParts.third}
          setSelectedParts={setSelectedParts}
          selectedParts={selectedParts}
        />
      </Col>
      <Col>
        {isThatDatasetExist ? <StyledSuccessIcon /> : <StyledErrorIcon />}
      </Col>
    </Row>
  );
};
