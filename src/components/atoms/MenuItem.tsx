import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
    Collapse,
    Link,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import { useState } from 'react';

export const MenuItem = ({
  allowedPermissions,
  ...menuItem
}) => {
  const [open, setOpen] = useState(true);

  const hasAccess = !menuItem.permission || allowedPermissions.includes(menuItem.permission);

  if (!hasAccess) return null;

  const listItemButtonStyle = {
    color: "#333",
    transition: "all 0.3s ease-in-out",
    '& .MuiListItemIcon-root': {
      color: (theme) => theme.palette.primary.main,
    },
    '&:hover': {
      background: (theme) => theme.palette.primary.main,
      color: "#fff",
      '& .MuiListItemIcon-root': {
        color: "#fff",
      },
    },
  };

  if (menuItem.subMenu && menuItem.subMenu.length > 0) {
    return (
      <>
        <ListItemButton 
          sx={listItemButtonStyle}
        >
          <ListItemIcon>
            {menuItem.icon}
          </ListItemIcon>
          <ListItemText onClick={() => window.location.href = menuItem.route} primary={menuItem.name} />
          {open ? <ExpandLess onClick={() => setOpen(!open)} /> : <ExpandMore onClick={() => setOpen(!open)} />}
        </ListItemButton>
        
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" sx={{
            padding: " 0 0 0 2rem"
          }}>
            {menuItem.subMenu.map((subItem, index) => {
              const hasSubAccess = !subItem.permission || allowedPermissions.includes(subItem.permission);
              if (!hasSubAccess) return null;
              
              return (
                <Link
                  key={index}
                  href={subItem.route}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <ListItemButton sx={listItemButtonStyle}>
                    {subItem.icon && (
                      <ListItemIcon>
                        {subItem.icon}
                      </ListItemIcon>
                    )}
                    <ListItemText primary={subItem.name} />
                  </ListItemButton>
                </Link>
              )
            })}
          </List>
        </Collapse>
      </>
    );
  }

  // Item normal (sem submenu)
  return (
    <Link
      href={menuItem.route}
      sx={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <ListItemButton sx={listItemButtonStyle}>
        <ListItemIcon>
          {menuItem.icon}
        </ListItemIcon>
        <ListItemText primary={menuItem.name} />
      </ListItemButton>
    </Link>
  );
}