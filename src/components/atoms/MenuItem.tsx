import { Link, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

export const MenuItem = ({
    allowedPermissions,
    ...menuItem
}) => {
    const hasAccess = !menuItem.permission || allowedPermissions.includes(menuItem.permission);

    if (!hasAccess) return null;

    return (
        <Link
            href={`${menuItem.route}`}
            sx={{
                textDecoration: "none",
                color: "#333",
                transition: "translate 0.3s ease-in-out",
                '&:hover': {
                    background: (theme) => theme.palette.primary.main,
                    color: "#fff",
                    transition: "translate 0.3s ease-in-out",
                },
                '&.MuiListItemIcon-root': {
                    color: (theme) => theme.palette.primary.main,
                },
            }}
        >
            <ListItemButton
                sx={{
                    '&:hover': {
                        background: (theme) => theme.palette.primary.main,
                        color: "#fff",
                        '& .MuiListItemIcon-root': {
                            color: "#fff",
                        },
                    },
                }}
            >
                <ListItemIcon>
                    {menuItem.icon}
                </ListItemIcon>
                <ListItemText primary={menuItem.name} />
            </ListItemButton>
        </Link>
    )
}