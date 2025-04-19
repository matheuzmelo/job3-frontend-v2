import { List } from "@mui/material";
import { menuLayout } from "../../routes/menu";
import { MenuItem } from "../atoms/MenuItem";

export const MenuList = ({ permissions }: { permissions: string[] }) => {
  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "240px",
        flexGrow: 1,
      }}
    >
      {[
        ...menuLayout.filter((item) => item.name === "Home"),
        ...menuLayout
          .filter((item) => item.name !== "Home")
          .sort((a, b) => a.name.localeCompare(b.name)),
      ].map((item) => (
        <MenuItem key={item.route} {...item} allowedPermissions={permissions} />
      ))}
    </List>
  );
};
