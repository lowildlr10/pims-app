'use client';

import { API_REFRESH_INTERVAL } from '@/config/intervals';
import API from '@/libs/API';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataTableClient from '../Generic/DataTable';

const defaultTableData: TableDataType = {
  head: [
    {
      id: 'fullname',
      label: 'Full Name',
      width: '25%',
      sortable: true,
    },
    {
      id: 'department_section',
      label: 'Department - Section',
      width: '15%',
      sortable: true,
    },
    {
      id: 'position_designation',
      label: 'Position - Designation',
      width: '15%',
      sortable: true,
    },
    {
      id: 'email',
      label: 'Email',
      width: '10%',
      sortable: true,
    },
    {
      id: 'phone',
      label: 'Phone',
      width: '10%',
      sortable: true,
    },
    {
      id: 'user_roles',
      label: 'Roles',
      width: '25%'
    }
  ],
  body: [],
};

const UserssClient = ({
  user,
  permissions,
}: RolesProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [columnSort, setColumnSort] = useState('firstname');
  const [sortDirection, setSortDirection] = useState('desc');
  const [paginated] = useState(true);
  const [tableData, setTableData] = useState<TableDataType>(
    defaultTableData ?? {}
  );

  const { data, isLoading } = useSWR<UsersResponse>(
    [
      `/accounts/users`,
      search,
      page,
      perPage,
      columnSort,
      sortDirection,
      paginated,
    ],
    ([url, search, page, perPage, columnSort, sortDirection, paginated]: any) =>
      API.get(url, {
        search,
        page,
        per_page: perPage,
        column_sort: columnSort,
        sort_direction: sortDirection,
        paginated,
      }),
    {
      refreshInterval: API_REFRESH_INTERVAL,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    const _data = data?.data?.map((body: UserType) => {
      return {
        ...body,
        user_roles: body.roles?.map(role => role.role_name).join(', ') ?? '-',
        department_section: `${body.department?.department_name} [${body.section?.section_name}]`,
        position_designation: `${body.position?.position_name} [${body.designation?.designation_name}]`,
        phone: body.phone ?? '-'
      };
    });

    setTableData((prevState) => ({
      ...prevState,
      body: _data ?? [],
    }));
  }, [data]);

  return (
    <DataTableClient
      permissions={permissions}
      columnSort={columnSort}
      sortDirection={sortDirection}
      search={search}
      data={tableData}
      perPage={perPage}
      loading={isLoading}
      page={page}
      lastPage={data?.last_page ?? 0}
      from={data?.from ?? 0}
      to={data?.to ?? 0}
      total={data?.total ?? 0}
      onChange={(_search, _page, _perPage, _columnSort, _sortDirection) => {
        setSearch(_search ?? '');
        setPage(_page);
        setPerPage(_perPage);
        setColumnSort(_columnSort ?? columnSort);
        setSortDirection(_sortDirection ?? 'desc');
      }}
      showSearch
    />
  );
};

export default UserssClient;
