import React, {useState, useEffect} from "react";
import './Main.css';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import GetAppIcon from '@material-ui/icons/GetApp';

import { 
    doSearch
 } from '../resources.js';

const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      //width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
}));

const useStyles1 = makeStyles((theme) => ({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
}));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="last page"
        >
            {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};


const Main = () => {
    const classes = useStyles();

    const [bookToSearch, setBookToSearch] = useState("");
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [error, setError]=useState(false);
    const [displayModal, setDisplayModal] = useState ("none");
    const [displayLoading, setDisplayLoading] = useState ("none");    
    const [displayImg, setDisplayImg] = useState ("none");    
    const [imageToDisplay, setImageToDisplay] = useState("");

    const headCells = [
        { id: 'Tittle', numeric: false, disablePadding: true, label: 'Tittle' },
        { id: 'Subittle', numeric: false, disablePadding: false, label: 'Subittle' },
        { id: 'Isbn13', numeric: false, disablePadding: false, label: 'Isbn13' },
        { id: 'Price', numeric: true, disablePadding: false, label: 'Price' },
        { id: 'Url', numeric: true, disablePadding: false, label: 'Url' },
    ];

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, books.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleClick = async () =>{
        if (bookToSearch != ""){
            const info = await doSearch(bookToSearch);
            setBooks(info);
            setBtnDisabled(false);
            setError(false);
        }else{
            setError(true);
        }        
    }

    const linkClicked = (event) => {
        event.preventDefault();
        let val = event.target.id
        console.log("click", val );

        for (let i=0; i<books.length; i++){
            //console.log(books[i].title);
            if (books[i].title == val){
                setImageToDisplay(books[i].image);
                setDisplayModal('block');
                setDisplayLoading('block');
                setDisplayImg("none");
                setTimeout(() => {
                    setDisplayLoading("none");
                    setDisplayImg(true);
                }, 500);
            }
        }
    }

    function exportTableToExcel(tableID, filename = ''){
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        
        // Specify file name
        filename = filename?filename+'.xls':'excel_data.xls';
        
        // Create download link element
        downloadLink = document.createElement("a");
        
        document.body.appendChild(downloadLink);
        
        if(navigator.msSaveOrOpenBlob){
            var blob = new Blob(['ufeff', tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob( blob, filename);
        }else{
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
        
            // Setting the file name
            downloadLink.download = filename;
            
            //triggering the function
            downloadLink.click();
        }
    }

    return (
        <div className="App">
            <div  id="myPopUp2"  style={{ display: displayModal}}>
                <div className="popup">
                        <span className="helper"></span>
                        <div className="text-center" style={{alignContent:'center'}}>                            
                            <img style={{display:displayImg, alignContent:'center'}} src={imageToDisplay} />
                            
                            <div style={{display:displayLoading}}>
                                <div className="cssload-loader text-center">
                                    <div className="cssload-inner cssload-one" />
                                    <div className="cssload-inner cssload-two" />
                                    <div className="cssload-inner cssload-three" />
                                </div>
                                <p>Loading...</p> 
                            </div>
                                                       
                            <div className='col-md-6 mb-6'>
                                <Button 
                                    variant="outlined" 
                                    color="secondary"
                                    onClick={() => setDisplayModal("none")}
                                >
                                    Close
                                </Button>                                              
                            </div>
                        </div>
                </div>
            </div>

            <header className="App-header">
                <Paper component="form" className={classes.root}>
                    <IconButton className={classes.iconButton} aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <TextField 
                        error = {error}
                        id="standard-basic" 
                        label="Search" 
                        onChange = {(e) => setBookToSearch(e.target.value)} 
                    />                    
                    <Divider className={classes.divider} orientation="vertical" />
                    <Button variant="outlined" color="primary"  onClick={() => { handleClick() }}>
                        <SearchIcon />
                    </Button>
                </Paper>

                <TableContainer 
                    component={Paper} 
                    style={{
                        width:'75%',
                        margin:'15px',                        
                    }}
                >
                    <Table id='tblData' className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align='center'
                                        padding={headCell.disablePadding ? 'none' : 'normal'}
                                        style={{fontWeight:'bold'}}

                                    >                                        
                                        {headCell.label}
                                        
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {(rowsPerPage > 0
                            ? books && books.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : books
                        ).map((row) => (
                            <TableRow key={row.title}>
                                <TableCell component="th" scope="row">                                    
                                    <span 
                                        id={row.title} 
                                        onClick={(e) => {linkClicked(e)}}
                                        style={{ color: "#005cbf", fontWeight: "bold"}}> 
                                        {row.title}
                                    </span>
                                </TableCell>
                                <TableCell align="left">{row.subtitle}</TableCell>
                                <TableCell align="right">{row.isbn13}</TableCell>
                                <TableCell align="right">{row.price}</TableCell>
                                <TableCell align="right">{row.url}</TableCell>
                            </TableRow>
                        ))}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                            </TableRow>
                        )}
                        </TableBody>  
                    </Table>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={books.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                    <Divider />                
                    
                    <Button 
                        disabled={btnDisabled}
                        variant="outlined" 
                        color="primary"  
                        onClick={() => { exportTableToExcel('tblData') }}
                        style={{margin:'10px'}}
                    >
                        <GetAppIcon /> Download
                    </Button>
                </TableContainer>

                
            
            </header>
        </div>
    );
}

export default Main;