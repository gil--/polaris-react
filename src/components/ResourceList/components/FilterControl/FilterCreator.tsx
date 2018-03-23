import * as React from 'react';
import {autobind} from '@shopify/javascript-utilities/decorators';

import {Button, Popover, Select, FormLayout} from '../../../';
import Form from '../../../Form';
import {withProvider, WithProviderProps} from '../../../Provider';

import FilterValueSelector from './FilterValueSelector';
import {AppliedFilter, Filter} from './types';

export interface Props {
  filters: Filter[];
  resourceName: {
    singular: string;
    plural: string;
  };
  onAddFilter?(newFilter: AppliedFilter): void;
}

export type CombinedProps = Props & WithProviderProps;

export interface State {
  popoverActive: boolean;
  selectedFilter?: Filter;
  selectedFilterValue?: AppliedFilter['value'];
}

class FilterCreator extends React.PureComponent<CombinedProps, State> {
  state: State = {
    popoverActive: false,
  };

  private get canAddFilter() {
    return Boolean(this.state.selectedFilter && this.state.selectedFilterValue);
  }

  render() {
    const {filters, resourceName, polaris: {intl}} = this.props;
    const {popoverActive, selectedFilter, selectedFilterValue} = this.state;

    const activator = (
      <Button
        onClick={this.togglePopover}
        disclosure
        testID="FilterCreator-FilterActivator"
      >
        {intl.translate('Polaris.ResourceList.FilterCreator.filterButtonLabel')}
      </Button>
    );

    const filterOptions = filters.map(({key, label}) => ({
      value: key,
      label,
    }));

    const filterValueSelectionMarkup = selectedFilter ? (
      <FilterValueSelector
        filter={selectedFilter}
        value={selectedFilterValue}
        onChange={this.handleFilterValueChange}
      />
    ) : null;

    const addFilterButtonMarkup = selectedFilter ? (
      <Button
        onClick={this.handleAddFilter}
        disabled={!this.canAddFilter}
        testID="FilterCreator-AddFilterButton"
      >
        {intl.translate(
          'Polaris.ResourceList.FilterCreator.addFilterButtonLabel',
        )}
      </Button>
    ) : null;

    return (
      <Popover
        active={popoverActive}
        activator={activator}
        onClose={this.togglePopover}
        sectioned
      >
        <Form onSubmit={this.handleAddFilter}>
          <FormLayout>
            <Select
              label={intl.translate(
                'Polaris.ResourceList.FilterCreator.showAllWhere',
                {resourceNamePlural: resourceName.plural.toLocaleLowerCase()},
              )}
              placeholder={intl.translate(
                'Polaris.ResourceList.FilterCreator.selectFilterKeyPlaceholder',
              )}
              options={filterOptions}
              onChange={this.handleFilterKeyChange}
              value={selectedFilter && selectedFilter.key}
            />
            {filterValueSelectionMarkup}
            {addFilterButtonMarkup}
          </FormLayout>
        </Form>
      </Popover>
    );
  }

  @autobind
  private togglePopover(): void {
    this.setState(({popoverActive}) => ({popoverActive: !popoverActive}));
  }

  @autobind
  private handleFilterKeyChange(filterKey: string) {
    const {filters} = this.props;

    const foundFilter = filters.find((filter) => filter.key === filterKey);

    if (!foundFilter) {
      return;
    }

    this.setState({
      selectedFilter: foundFilter,
      selectedFilterValue: undefined,
    });
  }

  @autobind
  private handleFilterValueChange(filterValue: string) {
    this.setState({selectedFilterValue: filterValue});
  }

  @autobind
  private handleAddFilter() {
    const {onAddFilter} = this.props;
    const selectedFilterKey =
      this.state.selectedFilter && this.state.selectedFilter.key;

    if (!onAddFilter || !this.canAddFilter || !selectedFilterKey) {
      return;
    }

    onAddFilter({
      key: selectedFilterKey,
      value: this.state.selectedFilterValue || '',
    });
    this.setState({
      popoverActive: false,
      selectedFilter: undefined,
      selectedFilterValue: undefined,
    });
  }
}

export default withProvider()(FilterCreator);