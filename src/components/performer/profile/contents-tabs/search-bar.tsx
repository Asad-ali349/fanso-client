import {
  AppstoreOutlined,
  CalendarOutlined,
  MenuOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  DatePicker, Input, Button, Popover
} from 'antd';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

import classNames from 'classnames';
import {
  LiveIcon
} from 'src/icons';
import { useRouter } from 'next/router';
import style from './search-bar.module.scss';

const { RangePicker } = DatePicker;

const { Search } = Input;

interface IProps {
 performerId: string;
 tab: string;
}

export default function FilterContentsBar({
  performerId, tab
}: IProps) {
  const router = useRouter();
  const prevQuery = useRef(router.query);

  const handleFilter = (values) => {
    prevQuery.current = router.query;
    router.push({
      pathname: router.pathname,
      query: {
        performerId,
        ...router.query,
        ...values
      }
    }, undefined, { shallow: true });
  };

  const onSearch = debounce(async (e) => {
    const value = (e.target && e.target.value) || '';
    handleFilter({ q: value });
  }, 500);

  const onViewGrid = (val: boolean) => {
    handleFilter({ isGrid: val });
  };

  const searchDateRange = (dates: [any, any], dateStrings: [string, string]) => {
    if (!dateStrings.length) return;
    handleFilter({
      fromDate: dateStrings[0],
      toDate: dateStrings[1]
    });
  };

  const onFilterLive = () => {
    router.push({
      pathname: router.pathname,
      query: {
        performerId,
        ...router.query,
        type: router?.query?.type === '' ? 'scheduled-streaming' : ''
      }
    }, undefined, { shallow: false }); // force reload feeds
  };

  return (
    <div className={style['search-bar']}>
      <div className={style['grid-btns']}>
        {tab === 'post' && (
          <Button className={classNames({ active: router?.query?.type === 'scheduled-streaming' })} onClick={() => onFilterLive()}>
            <LiveIcon />
          </Button>
        )}
        <Popover
          trigger={['click']}
          content={(
            <Search
              placeholder="Enter keyword here..."
              onChange={(e) => {
                e.persist();
                onSearch(e);
              }}
              allowClear
              enterButton
            />
          )}
        >
          <Button><SearchOutlined /></Button>
        </Popover>
        <Popover
          trigger={['click']}
          content={(
            <RangePicker
              disabledDate={(current) => current > dayjs().endOf('day') || current < dayjs().subtract(10, 'years').endOf('day')}
              onChange={searchDateRange}
            />
          )}
        >
          <Button><CalendarOutlined /></Button>
        </Popover>
        {tab === 'post' && (
        <Button
          aria-hidden
          className={classNames({ active: router?.query?.isGrid === 'true' })}
          onClick={() => onViewGrid(true)}
        >
          <AppstoreOutlined />
        </Button>
        )}
        {tab === 'post' && (
        <Button
          aria-hidden
          className={classNames({ active: !router?.query?.isGrid || router?.query?.isGrid === 'false' })}
          onClick={() => onViewGrid(false)}
        >
          <MenuOutlined />
        </Button>
        )}
      </div>
    </div>
  );
}
