import Pagination from '@mui/material/Pagination';
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "../../theme"


// const StyledBadge = styled('div')(({ theme }) => ({
//   right: 20,
//   top: 15,
//   border: `2px solid ${theme.palette.background.paper}`,
//   padding: 5,
//   fontSize: 14,
//   height: 20,
// }));



const CustomPagination = ({ setPage, PageTotal = 10, page }) => {

  const handlePageChange = (e, page) => {
    console.log({ page });
    setPage(page);
    window.scroll(0, 0);
  };

  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <Pagination 
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: 10,
            marginBottom: 10,
          }}
          onChange={handlePageChange}
          count={PageTotal}
          color="primary"
          siblingCount={3}
          page={page}
          // variant="outlined"
          size="large"
        />
      </ThemeProvider>
    </div>
  )
}

export default CustomPagination