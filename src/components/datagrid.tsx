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
import { deleteContent, fetchAllContent, newContent, updateContent } from "../../actions/content";
import { Content } from '../models/content';
import { Dialog, DialogTitle, Button, DialogActions, DialogContent, TextField, Box, FormControl, OutlinedInput, InputLabel } from '@mui/material';
import { APIResponseDeleteContent } from '../models/APIResponseDeleteContent';
import { SnackbarContext } from '../hooks/SnackbarProvider';
import { ContentId } from '../models/contentId';



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
    };

    const { setSnackbar, setSnackbarMessage, setSnackbarSeverity } = useContext(SnackbarContext);


    const fetchContent = async (): Promise<void> => {
        let apiResponse: Content[] = await fetchAllContent();
        if (apiResponse != null) {
            setData(apiResponse);

        }
    }

    const handleDelete = async (): Promise<void> => {

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
        try {
            if (open == 'new') {
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
                await updateContent(content);
                setData((data) => {
                    return data.map(_content => {
                        if (_content.contentId == content.contentId) {
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
        <Box sx={{ width: "100%", mt: 5 }}>
            <Box width="90%" sx={{ display: "flex", justifyContent: "right" }} >
                <Button sx={{ mb: 1 }} onClick={() => { setOpen("new"); setDialogTitle("New Content"); }} variant='outlined'>+ Add</Button>
            </Box>


            <TableContainer sx={{ width: "80%", marginLeft: "10%" }} component={Paper}>
                <Table aria-label="simple table">
                    <TableHead >
                        <TableRow>
                            <TableCell sx={{ minWidth: 200 }}>Id</TableCell>
                            <TableCell sx={{ minWidth: 200 }} align="left">Content</TableCell>
                            <TableCell sx={{ minWidth: 100 }} align="right">Update</TableCell>
                            <TableCell sx={{ minWidth: 100 }} align="right">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow
                                key={row.contentId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.contentId}
                                </TableCell>
                                <TableCell align="justify">{row.content}</TableCell>
                                <TableCell align="right">{<EditIcon sx={{cursor:'pointer'}} onClick={() => initiateUpdate(row)} />}</TableCell>
                                <TableCell align="right">{<DeleteIcon   sx={{cursor:'pointer'}} onClick={() => handleClickOpen(row.contentId)} />}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </>
    );
}
