import { List } from "@mui/material";
import { menuLayout } from "../../routes/menu";
import { MenuItem } from "../atoms/MenuItem";

export const MenuList = ({ permissions }: { permissions: string[] }) => {
    return (
        <List sx={{
            display: "flex",
            flexDirection: "column",
            width: "240px",
            flexGrow: 1
        }}>
            {menuLayout.map(item => (
                <MenuItem
                    key={item.route}
                    {...item}
                    allowedPermissions={permissions} // Passa as permissões do usuário
                />
            ))}
        </List>)
}
