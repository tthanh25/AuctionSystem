import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import firebaseService from "~/services/firebase"; // Update the path to your Firebase service
import dayjs from "dayjs";
import { Alert, AlertTitle, Fade } from "@mui/material";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Tên",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Giá hiện tại",
  },
  {
    id: "priceIncrement",
    numeric: true,
    disablePadding: false,
    label: "Bước giá",
  },
  {
    id: "auctionStart",
    numeric: true,
    disablePadding: false,
    label: "Bắt đầu",
  },
  {
    id: "auctionEnd",
    numeric: true,
    disablePadding: false,
    label: "Kết thúc",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Trạng thái",
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell sx={{fontWeight:"Bold"}} key={headCell.id} align={headCell.numeric ? "right" : "left"} padding={headCell.disablePadding ? "none" : "normal"} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel sx={{display:"flex",justifyContent:"center"}} active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : "asc"} onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onDelete } = props;

  const handleDeleteClick = () => {
    onDelete();
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color="inherit" fontWeight="Bold" variant="h6" component="div">
          {numSelected} phiên đấu giá được chọn
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h5" fontWeight="Bold" id="tableTitle" component="div">
          Đơn đấu giá
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDeleteClick}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default function ManageOrder() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("price");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [items, setItems] = useState([]); // State for storing items
  const [countdown, setCountdown] = useState(0);


  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      // Xử lý khi thời gian chạy ngược đạt 0
      // Ví dụ: Hiển thị thông báo hoặc thực hiện một hành động
      console.log('Countdown finished!');
    }
    const fetchItems = async () => {
      try {
        const items = await firebaseService.getItems();
        const itemsWithTimeLeft = calculateTimeLeft(items);
        setItems(itemsWithTimeLeft);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [countdown]);
  const calculateTimeLeft = (items) => {
    return items.map((item) => {
      const auctionEndTime = item.auctionEnd.toMillis(); // Convert timestamp to milliseconds
      const currentTime = Date.now(); // Get current time in milliseconds
      const timeStart = currentTime - item.auctionStart.toMillis();
      let timeDiff = Math.max(0, auctionEndTime - currentTime); // Ensure time difference is non-negative
      const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60)); // Calculate remaining hours
      timeDiff -= hoursLeft * (1000 * 60 * 60); // Subtract hours from time difference
      const minutesLeft = Math.floor(timeDiff / (1000 * 60)); // Calculate remaining minutes
      timeDiff -= minutesLeft * (1000 * 60); // Subtract minutes from time difference
      const secondsLeft = Math.floor(timeDiff / 1000); // Calculate remaining seconds
      return { ...item, timeLeft: { hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft },timeStartNow: timeStart };
    });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = items.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleDeleteOrders = async () => {
    // Delete selected items from Firebase
    
    try {
      let role = JSON.parse(localStorage.getItem("role")); 
      if (role != 1) {
        setNotification({ message: "Bạn không có quyền", severity: "error" });
        return;
      }
      for (const id of selected) {
        await firebaseService.deleteItem(id);
      }
      setItems((prevItems) => prevItems.filter((item) => !selected.includes(item.id)));
      setSelected([]);
      setNotification({ message: "Xóa phiên đấu giá thành công", severity: "success" });
    } catch (error) {
      console.error("Error deleting items:", error);
      setNotification({ message: "Xóa phiên đấu giá thất bại", severity: "error" });
    }
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - items.length) : 0;

  const visibleRows = React.useMemo(() => stableSort(items, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [items, order, orderBy, page, rowsPerPage]);
  const [notification, setNotification] = useState({ message: "", severity: "success" });
  const handleCloseNotification = () => {
    setNotification({ message: "", severity: "success" });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper elevation={5} sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} onDelete={handleDeleteOrders} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
            <EnhancedTableHead numSelected={selected.length} order={order} orderBy={orderBy} onSelectAllClick={handleSelectAllClick} onRequestSort={handleRequestSort} rowCount={items.length} />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none" align="center"> 
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.currentPrice + ` $`} </TableCell>
                    <TableCell align="center">{row.priceIncrement + ` $`} </TableCell>
                    <TableCell align="center">{dayjs(row.auctionStart.seconds * 1000).format('DD/MM/YYYY, h:mm:ss A')} </TableCell>
                    <TableCell align="center">{dayjs(row.auctionEnd.seconds * 1000).format('DD/MM/YYYY, h:mm:ss A')} </TableCell>
                    <TableCell align="center">{(row.timeLeft.hours == 0 && row.timeLeft.minutes == 0 && row.timeLeft.seconds == 0)? 
                    <p style={{alignContent:"center",color:"white", background:"#52b202", fontWeight:"bold", padding:"6px",borderRadius:"4px",height:"max-content",display:"flex",justifyContent:"center"}}>Kết thúc</p> 
                    :(row.timeStartNow >= 0)?<p style={{color:"white",background:"#ff9800", fontWeight:"bold",padding:"6px",borderRadius:"4px",height:"max-content",display:"flex",justifyContent:"center"}}>Đang diễn ra </p> 
                    : <p style={{color:"white", background:"#03a9f4", fontWeight:"bold",padding:"6px",borderRadius:"4px",height:"max-content",display:"flex",justifyContent:"center"}}>Chờ</p> }</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {notification.message && (
            <Fade in = {notification.message} timeout={500}>
            <Alert severity={notification.severity} onClose={handleCloseNotification}
            variant="filled"
            sx={{
              position: "fixed",
              fontSize: "1.0rem",
              left: "48px",
              bottom: "48px",
              zIndex: 100,
              width: "45%",
            }}>
            
              <AlertTitle sx={{ fontSize: "1.2rem", fontWeight: "Bold" }}>{notification.severity == "success" ? ("Thành công") : ("Lỗi")}</AlertTitle>
              {notification.message}
            </Alert>
         </Fade>
          )}
      </Paper>
    </Box>
  );
}
