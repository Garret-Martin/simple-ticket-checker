import React from "react";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PeopleIcon from '@mui/icons-material/People';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';


export const SidebarData =  [
    {
        title: "Scanner",
        icon: <DocumentScannerIcon/>,
        link: "/scan"
    },
    {
        title: "Tickets",
        icon: <ConfirmationNumberIcon/>,
        link: "/admin/tickets"
    },
    {
        title: "Users",
        icon: <PeopleIcon/>,
        link: "/admin/users"
    },
    {
        title: "Logs",
        link: "/admin/logs"
    }
]