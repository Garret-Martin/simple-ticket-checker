import React, { useState, useEffect } from "react";
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import "./Tickets.css";


function Tickets() {
    const [currentPage, setCurrentPage] = useState(1);
    const [ticketsPerPage, setTicketsPerPage] = useState(50);
    const [loading, setLoading] = useState(false); //use when calling api
    const [tickets, setTickets] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [rows, setRows] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
      });
    const [editedTicket, setEditedTicket] = useState({
        ticketId: "",
      });
      const [newTicet, setNewTicket] = useState({
        ticketId: "",
      });
      const [ticketError, setTicketError] = useState("");

    

    const indexOfLast = currentPage * ticketsPerPage;
    const indexOfFirst = indexOfLast - ticketsPerPage;
    const currentTickets = tickets.slice(indexOfFirst, indexOfLast);

    useEffect(() => {
      setLoading(true);
        fetchTickets();
        const fetchData = async () => {
          const data = await fetchTickets();
          setRows(data.content);
          setTotalCount(data.totalElements);
          setLoading(false);
        }
        fetchData();
      }, [currentPage, ticketsPerPage, searchQuery, refreshTrigger, paginationModel]);

    async function fetchTickets() {
        try {
          var response;
          if(searchQuery.length > 0) { //if we are searching
             response = await fetch(
              `http://localhost:8080/api/admin/tickets?search=${searchQuery}&page=${paginationModel.page}&size=${paginationModel.pageSize}`, {
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json", // Ensure content type is JSON
                  "Accept": "application/json", // Accept JSON response
                  "Origin": "http://localhost:5173", // Explicitly specify frontend origin
                }
              }
            );
            return response.json();
          }
          else {
             response = await fetch(
              `http://localhost:8080/api/admin/tickets?page=${paginationModel.page}&size=${paginationModel.pageSize}`, {
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json", // Ensure content type is JSON
                  "Accept": "application/json", // Accept JSON response
                  "Origin": "http://localhost:5173", // Explicitly specify frontend origin
                }
              }
            );
            return response.json();
          }
          if (!response.ok) {
            throw new Error("Failed to fetch tickets");
          }
          const data = await response.json();
          setTickets(data.content || []); // Assuming data.content holds paginated data
        } catch (error) {
          console.log("API ERROR: ", error);
          return { content: [], totalElements: 0 };
        }
      }

      const columns = [
          { field: "id", headerName: "Ticker Number", width: 200 },
          { field: "checkedIn", headerName: "checkedIn", width: 100 },
          { field: "created_at", headerName: "Created At", width: 180 },
          { field: "updatedAt", headerName: "Updated At", width: 180 },
          { field: "createdBy", headerName: "Created By", width: 180 },
          { field: "checkedInAt", headerName: "Checked In At", width: 180 },
          {
            field: "actions",
            headerName: "Actions",
            width: 250,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleEditClick(params.row)}
                >
                  Edit
                </Button>
                <Button size="small" color="error" variant="contained" onClick={() => console.log(params.row.id)}>
                  Delete
                </Button>
              </Box>
            ),
          },
        ];
      //<TicketList className="ticketList" tickets={tickets} loading={loading}></TicketList>
    return (
        <div>
            <div className="topArea">
                <div className="iconAndCreate">
                    <LocalActivityIcon id="icon"/>
                    <button id="createButton">New Ticket</button>
                </div>
                <div className="search">
                    <div id="icon" onClick={(e) => {setSearchQuery("")}}>
                      <ClearIcon/>
                    </div>
                    <input placeholder="Search" onInput={(e) => { setSearchQuery(e.target.value) } } value={searchQuery}/>
                </div>
            </div>
            <Paper sx={{ width: "98%", margin: "1%"}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <TextField
            label="Search Tickets"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value)}}
            sx={{ flexGrow: 1, mr: 2 }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            /*onClick={openCreateDialog}*/
          >
            Add Tickets
          </Button>
        </Box>
        <Box sx={{ 
          height: "70%", 
          width: "100%",
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none'
          }
        }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            paginationMode="server"
            rowCount={totalCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick
            loading={loading}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
              },
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: '2px solid rgba(224, 224, 224, 1)',
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: 'white',
              }
            }}
          />
        </Box>
      </Paper>
        </div>
    );
}

export default Tickets;