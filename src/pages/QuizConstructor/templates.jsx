import { Stack, TextField, Button, Box } from "@mui/material";

export const questionTemplate = () => (
    <Box display="flex" justifyContent="center" gap="1rem" direction="row" spacing={2}>
      <TextField id="outlined-basic" label="Quiz title" variant="outlined" />
      <Button variant="contained" component="label">
        Upload
      <input hidden accept="image/*" multiple type="file" />
      </Button>
      <Box display="flex" justifyContent="center" gap="1rem" direction="row" spacing={2}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" component="label"></Button>
          <Button variant="contained" component="label"></Button>
          <Button variant="contained" component="label"></Button>
          <Button variant="contained" component="label"></Button>
        </Stack>
      </Box>
    </Box>
)
