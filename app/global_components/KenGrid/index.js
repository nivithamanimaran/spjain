import React from 'react';
import { Typography } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Collapse from '@material-ui/core/Collapse';
import PropTypes from 'prop-types';

import {
  useExpanded,
  useGlobalFilter,
  useGroupBy,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import {
  Box,
  Grid,
  InputAdornment,
  makeStyles,
  TableFooter,
  TablePagination,
  TableSortLabel,
  useTheme,
} from '@material-ui/core';
import KenInputField from '../KenInputField';
import TableToolbar from './TableToolbar';
import TablePaginationActions from './TablePaginationActions';
import { AiFillCaretRight, AiFillCaretDown } from 'react-icons/ai';

import SearchIcon from '@material-ui/icons/Search';
import { useTranslation } from 'react-i18next';

// pagination={{
//     pageSize: 4,
//     pageIndex: 0,
//     rowsPerPageOptions: [1, 2, 4, 10],
//   }}
// toolbarDisabled : false

export default function KenGrid({
  columns = [],
  isCollasable = isCollasable,
  component,
  data = [],
  searchEnabled,
  title = 'My Students',
  tableInnerProps,
  pagination,
  toolbarDisabled,
  noDataText,
  gridProps = {},
  initialState = {},
  rowClick,
  styleprops = {},
  Collapseclass,
}) {
  const { t } = useTranslation();
  columns = React.useMemo(() => columns, [columns]);

  data = React.useMemo(() => data, [data]);
  // default pagination pros
  pagination = {
    disabled: true,
    rowsPerPageOptions: [10, 25, 50, { label: 'All', value: data?.length }],
    ...pagination,
  };
  const tableProps = {
    initialState: {
      ...(pagination?.pageSize && { pageSize: pagination?.pageSize }),
      ...(pagination?.pageIndex && { pageIndex: pagination?.pageIndex }),
      ...initialState,
    },
  };

  return (
    <div>
      <CssBaseline />
      <Table
        columns={columns}
        isCollasable={isCollasable}
        component={component}
        data={data}
        Collapseclass={Collapseclass}
        rowClick={rowClick}
        // getHeaderProps={hooks => {
        //   hooks.getHeaderProps = [
        //     ...hooks.getHeaderProps,
        //     header => {
        //       console.log(header);
        //       return { border: '1px solid blue' };
        //     },
        //   ];
        // }}
        searchEnabled={searchEnabled}
        title={title}
        tableProps={tableProps}
        pagination={pagination}
        toolbarDisabled={toolbarDisabled || false}
        noDataText={noDataText}
        style={styleprops}
        {...gridProps}
      />
    </div>
  );
}

const useTableStyles = makeStyles(theme => ({
  tbody: {
    // minHeight: 200,
    backgroundColor: 'white',
    // padding: "4px 26px",
    // // width: '100%',
    // [theme.breakpoints.down('sm')]: {
    //   padding: "4px 26px"
    // },
  },
  footer: {
    backgroundColor: '#E7ECFF',
  },
  cellRoot: {
    textAlign: '-webkit-center',
  },
  nodatatxt:{
    fontSize: 14
  }
}));

const defaultPropGetter = () => ({});

function Table({
  columns,
  isCollasable,
  tableVisible = true,
  component,
  data,
  searchEnabled,
  title,
  rowClick,
  tableProps = {},
  pagination,
  Collapseclass,
  toolbarDisabled,
  loading,
  loadingText,
  noDataText,
  footerRows, // array of row numbers [inner most row is the first] in footer
  footerStyles = {},
  footerCellStyles = {},
  updateMyData,
  defaultColumn,
  headerVisible = true,
  getGridProps = defaultPropGetter,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
}) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
    footerGroups,
  } = useTable(
    {
      columns,
      isCollasable,
      component,
      Collapseclass,
      data,
      tableVisible,
      ...tableProps,
      defaultColumn,
      updateMyData,
    },
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination
  );

  const classes = useTableStyles();
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setPageSize(Number(event.target.value));
  };

  const getCurrentRows = () => {
    return pagination?.disabled ? rows : page;
  };

  // Render the UI for your table
  return (
    <Box padding="2">
      {!toolbarDisabled ? (
        <TableToolbar
          searchEnabled={searchEnabled}
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={globalFilter}
        />
      ) : null}
      <MaUTable {...getTableProps()}>
        {headerVisible && (
          <GridHeader
            headerGroups={headerGroups}
            getHeaderProps={getHeaderProps}
            getColumnProps={getColumnProps}
          />
        )}
        <TableBody className={classes.tbody}>
          {tableVisible &&
            getCurrentRows()?.map((row, i) => {
              prepareRow(row);
              return (
                <GridBodyRow
                  row={row}
                  index={i}
                  isCollasable={isCollasable}
                  component={component}
                  getRowProps={getRowProps}
                  getCellProps={getCellProps}
                  getColumnProps={getColumnProps}
                  getGridProps={getGridProps}
                  rowClick={rowClick}
                  Collapseclass={Collapseclass}
                />
              );
            })}
          {getCurrentRows()?.length === 0 ? (
            <GridNoDataComponent>
              <Typography className={classes.nodatatxt}>{noDataText}</Typography>
            </GridNoDataComponent>
          ) : null}
        </TableBody>

        <TableFooter>
          {footerGroups?.map((group, index) => {
            if (footerRows?.includes(index + 1)) {
              return (
                <TableRow
                  {...group.getFooterGroupProps()}
                  classes={{ footer: classes.footer }}
                  style={{ ...footerStyles }}
                >
                  {group.headers.map(column => (
                    <TableCell
                      {...column.getFooterProps()}
                      classes={{ root: classes.cellRoot }}
                      style={{ ...footerCellStyles }}
                    >
                      {column?.render('Footer')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            }
          })}

          {!pagination?.disabled && (
            <TableRow>
              <TablePagination
                rowsPerPageOptions={pagination.rowsPerPageOptions}
                //   colSpan={3}

                count={data.length}
                rowsPerPage={pageSize}
                page={pageIndex}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          )}
        </TableFooter>
      </MaUTable>
    </Box>
  );
}

const useGridBodyRowStyles = makeStyles(theme => ({
  tr: {},
  cellRoot: {
    textAlign: '-webkit-left',
    // padding: '16px 0px 30px 30px',
    // borderBottom: 'none',
    ['@media (max-width:600px)']: {
      padding: '10px',
      textAlign: '-webkit-left',
    },
  },
}));

const GridBodyRow = ({
  row,
  index,
  getRowProps,
  getColumnProps,
  getCellProps,
  rowClick,
  isCollasable,
  component: Component,
  Collapseclass,
  getGridProps,
}) => {
  const classes = useGridBodyRowStyles();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  return (
    <>
      <TableRow
        {...row.getRowProps(getRowProps(row))}
        onClick={() => (rowClick ? rowClick(row, index) : null)}
        className={classes.tr}
      >
        <>
          {row.cells.map((cell, index) => {
            return (
              <>
                {isCollasable && index === 0 ? (
                  <>
                    <TableCell
                      // {...cell.getCellProps()}
                      onclick={rowClick}
                      classes={{ root: classes.cellRoot }}
                      {...cell.getCellProps([
                        {
                          className: cell.column.className,
                          style: cell.column.style,
                        },
                        getColumnProps(cell.column),
                        getCellProps(cell),
                      ])}
                    >
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        style={{ marginRight: 30 }}
                        onClick={() => setOpen(!open)}
                      >
                        {open ? <ChevronRightIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                      {cell.render('Cell')}
                    </TableCell>
                  </>
                ) : (
                  <TableCell
                    // {...cell.getCellProps()}
                    onclick={rowClick}
                    classes={{ root: classes.cellRoot }}
                    {...cell.getCellProps([
                      {
                        className: cell.column.className,
                        style: cell.column.style,
                      },
                      getColumnProps(cell.column),
                      getCellProps(cell),
                    ])}
                  >
                    <span
                      className={`${cell.column.id}-${
                        cell.row.original?.['Grade Name']
                      }`}
                    >
                      <span>{cell.render('Cell')}</span>
                    </span>
                  </TableCell>
                )}
              </>
            );
          })}
        </>
      </TableRow>
      {isCollasable ? (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            className={Collapseclass ? Collapseclass : ''}
            colSpan={8}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Component {...row} />
            </Collapse>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
};
GridBodyRow.propTypes = {
  row: PropTypes.object.required,
};
export { GridBodyRow };

const useGridHeaderStyles = makeStyles(theme => ({
  root: {},
  tr: {
    '&:last-child $td': {
      paddingBottom: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.KenColors.neutral40}`,
    },
    '&:first-child $td': {
      paddingTop: theme.spacing(2),
    },
  },
  td: {
    border: 'none',
    lineHeight: 1,
    // textAlign: 'center',
    padding: '0 8px',
  },
  head: {
    fontSize: '10px',
    lineHeight: '150%',
    // textTransform: 'uppercase',
    backgroundColor: 'rgb(241, 245, 250)',
    color: 'rgb(9, 38, 130)',
  },
  cellRoot: {
    textAlign: '-webkit-left',
    padding: '16px',
    // width: '190px',
    ['@media (max-width:600px)']: {
      padding: '0px',
      textAlign: '-webkit-center',
    },
  },
}));
const GridHeader = ({ headerGroups, getColumnProps, getHeaderProps }) => {
  const classes = useGridHeaderStyles();
  const theme = useTheme();
  return (
    <TableHead className={classes.root}>
      {headerGroups.map((headerGroup, index) => (
        <TableRow {...headerGroup.getHeaderGroupProps()} className={classes.tr}>
          {headerGroup.headers.map(column => (
            <TableCell
              {...(column.id === 'selection'
                ? column.getHeaderProps()
                : column.getHeaderProps(column.getSortByToggleProps()))}
              className={[classes.td, classes.head].join(' ')}
              classes={{ root: classes.cellRoot }}
              {...column.getHeaderProps([
                {
                  className: column.className,
                  style: column.style,
                },
                getColumnProps(column),
                getHeaderProps(column),
              ])}
            >
              {column.render('Header')}
              {column.id !== 'selection' && column.isSorted ? (
                <TableSortLabel
                  active={column.isSorted}
                  // react-table has a unsorted state which is not treated here
                  direction={column.isSortedDesc ? 'desc' : 'asc'}
                />
              ) : null}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableHead>
  );
};

GridHeader.propTypes = {
  headerGroups: PropTypes.array.isRequired,
};

export { GridHeader };

function GridNoDataComponent({ children }) {
  return (
    <Box
      style={{ minHeight: 52 }}
      alignItems="center"
      justifyContent="center"
      display="flex"
    >
      {children}
    </Box>
  );
}

GridNoDataComponent.propTypes = {};

export { GridNoDataComponent };
