import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { deleteContent, fetchAllContent, newContent, updateContent } from "../actions/content";
import { Content } from '../models/content';
import { Dialog, DialogTitle, Button, DialogActions, DialogContent, TextField, Box, FormControl, OutlinedInput, InputLabel, Typography, styled } from '@mui/material';
import { APIResponseDeleteContent } from '../models/APIResponseDeleteContent';
import { SnackbarContext } from '../hooks/SnackbarProvider';
import { ContentId } from '../models/contentId';
import { BackdropContext } from '../hooks/BackdropProvider';

const StyledTableCell = styled(TableCell)`
//   border: 1px solid #DDDDDD;
`;

export default function DataTable() {

    const [data, setData] = useState<Content[]>([]);

    const [contentId, setContentId] = useState<string>("");

    const [open, setOpen] = useState<string>("");

    const [inputContent, setInputContent] = useState<string>("");

    const [inputContentId, setInputContentId] = useState<ContentId>({
        pageNo: 1,
        sectionNo: 1,
        elementNo: 1
    });

    const { setBackdrop, setBackdropMessage } = useContext(BackdropContext);


    const [dialogTitle, setDialogTitle] = useState<string>("");

    const handleClickOpen = (contentId: string) => {
        setOpen("delete");
        setContentId(contentId);
    };

    const handleClose = () => {
        setOpen("");
        setInputContent("");
        setInputContentId({
            pageNo: 1,
            sectionNo: 1,
            elementNo: 1
        });
        setContentId("");
    };

    const { setSnackbar, setSnackbarMessage, setSnackbarSeverity } = useContext(SnackbarContext);


    const fetchContent = async (): Promise<void> => {
        setBackdrop(true);
        setBackdropMessage("Fetching Content");
        let apiResponse: Content[] = await fetchAllContent();
        if (apiResponse != null) {
            setData(apiResponse);

        }
        setBackdrop(false);
    }

    const handleDelete = async (): Promise<void> => {
        setBackdrop(true);
        setBackdropMessage("Deleting Content");
        const response: APIResponseDeleteContent = await deleteContent(contentId);
        setOpen("");
        setSnackbar(true);
        if (response != null) {
            setSnackbarMessage(response.payload);
            setSnackbarSeverity('success');
            removeContent(contentId);
        }
        else {
            setSnackbarMessage("SomeThing Went Wrong");
            setSnackbarSeverity('error');
        }
        setBackdrop(false);

    }

    const removeContent = (contentId: string): void => {
        setData(data => {
            return data.filter(content => content.contentId != contentId);
        });
    }

    const handleNewContent = async (): Promise<void> => {
        const content: Content = {
            contentId: `page${inputContentId.pageNo}-sec${inputContentId.sectionNo}-ele${inputContentId.elementNo}`,
            content: inputContent
        };
        setBackdrop(true);
        try {

            if (open == 'new') {
                setBackdropMessage("Adding New Content");
                await newContent(content);
                setData((data) => {
                    return [...data, content]
                }
                );
                setSnackbar(true);
                setSnackbarMessage("Successfully Added");
                setSnackbarSeverity("success");

            }
            else {
                setBackdropMessage("Updating Content");
                await updateContent(content, contentId);
                setData((data) => {
                    return data.map(_content => {
                        if (_content.contentId == contentId) {
                            return content;
                        }
                        return _content;
                    })
                });
                setSnackbar(true);
                setSnackbarMessage("Successfully Updated");
                setSnackbarSeverity("success");
            }


        }
        catch (error: any) {
            setSnackbar(true);
            setSnackbarMessage(error.toString().substring(7));
            setSnackbarSeverity("error");
        }
        setBackdrop(false);
        handleClose();
    }




    const handleContentIdInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setInputContentId((inputData) => { return { ...inputData, [event.target.name]: event.target.value } });


    }

    const handleContentInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setInputContent(event.target.value);
    }

    const initiateUpdate = (content: Content): void => {
        setInputContent(content.content);
        setContentId(content.contentId);
        const subId: string[] = content.contentId.split("-");
        setInputContentId({
            pageNo: Number(subId[0].substring(4)),
            sectionNo: Number(subId[1].substring(3)),
            elementNo: Number(subId[2].substring(3))
        })
        setDialogTitle("Update Content");
        setOpen("edit")
    }

    useEffect(() => {
        fetchContent();
    }, []);
    return (<>
        <Dialog
            open={open == "delete"}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Are you sure, you want to delete this content?"}
            </DialogTitle>

            <DialogActions>
                <Button onClick={handleClose} autoFocus>No</Button>
                <Button onClick={handleDelete} >
                    Yes
                </Button>
            </DialogActions>
        </Dialog>

        <Dialog
            open={open == "new" || open == "edit"}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {dialogTitle}
            </DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >

                    <div>
                        <TextField
                            required
                            label="Page No"
                            type='number'
                            variant="standard"
                            name="pageNo"
                            value={inputContentId.pageNo}
                            onChange={handleContentIdInput}
                        />
                        <TextField
                            required
                            label="Section No"
                            type='number'
                            variant="standard"
                            name='sectionNo'
                            value={inputContentId.sectionNo}
                            onChange={handleContentIdInput}

                        />
                        <TextField
                            required
                            label="Element No"
                            type='number'
                            name='elementNo'
                            value={inputContentId.elementNo}
                            variant="standard"
                            onChange={handleContentIdInput}

                        />
                    </div>
                    <Box>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="content">Content</InputLabel>
                            <OutlinedInput
                                id="content"
                                label="Content"
                                type="text"
                                multiline={true}
                                rows={4}
                                value={inputContent}
                                onChange={handleContentInput}
                            />
                        </FormControl>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} >No</Button>
                <Button onClick={handleNewContent} type="submit">
                    {open == 'new' ? 'Add' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
        <Box sx={{ width: "100%", mt:"75px", position:"sticky",flexGrow:1 }}>
            <Box width="90%" sx={{ ml: "5%", display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                <Typography></Typography>
                <Button sx={{ mb: 1, color: "#151e28", borderColor: "#151e28" }} onClick={() => { setOpen("new"); setDialogTitle("New Content"); }} variant='outlined'>+ Add</Button>
            </Box>


            <TableContainer sx={{ width: "90%", marginLeft: "5%",height:"calc(100vh - 70px - 64px - 45px - 30px)", borderRadius:"10px"}} component={Paper}>
                <Table aria-label="simple table" stickyHeader>
                    <TableHead >
                        <TableRow>
                            <StyledTableCell sx={{ minWidth: 20 }}>
                                {"Page Id"}
                            </StyledTableCell>
                            <StyledTableCell sx={{ minWidth: 20 }}>Section Id</StyledTableCell>
                            <StyledTableCell sx={{ minWidth: 20 }}>Element Id</StyledTableCell>
                            <StyledTableCell sx={{ minWidth: 200 }} align="left">Content</StyledTableCell>
                            <StyledTableCell sx={{ minWidth: 100 }} align="right">Update</StyledTableCell>
                            <StyledTableCell sx={{ minWidth: 100 }} align="right">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{borderRadius:"10px"}}>
                        {data.map((row) => (
                            <TableRow
                                key={row.contentId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <StyledTableCell component="th" scope="row">
                                    {row.contentId.split("-")[0].substring(4)}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {row.contentId.split("-")[1].substring(3)}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {row.contentId.split("-")[2].substring(3)}
                                </StyledTableCell>
                                <StyledTableCell align="justify">{row.content}</StyledTableCell>
                                <StyledTableCell align="right">{<EditIcon sx={{ cursor: 'pointer' }} onClick={() => initiateUpdate(row)} />}</StyledTableCell>
                                <StyledTableCell align="right">{<DeleteIcon sx={{ cursor: 'pointer' }} onClick={() => handleClickOpen(row.contentId)} />}</StyledTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </>
    );
}
