import { Box } from "@mui/material";

const AdminCard = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 2,
        p: 3,
        mb: 3
      }}
    >
      {children}
    </Box>
  );
}; 

export default AdminCard;
