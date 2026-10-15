export const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'nickname', headerName: 'Nickname', flex: 1, align: 'left' },
    { field: 'email', headerName: 'Email', flex: 1, align: 'left' },
    {
        field: 'role',
        headerName: 'Role',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        renderCell: ({ row: { role } }) => {
            return (
                <Card
                    m="0 auto"
                    w="60%"
                    p="5px"
                    justifyContent="center"
                    backgroundColor="#71aaeb"
                    borderRadius="4px"
                >
                    <Stack direction="row">
                        {role === 'admin' && <AdminPanelSettingsOutlinedIcon />}
                        {role === 'user' && <AccountCircleOutlinedIcon />}
                        <p>{role}</p>
                    </Stack>
                </Card>
            );
        },
    },
    {
        field: 'isActivated',
        headerName: 'Activated',
        align: 'center',
        renderCell: ({ row: { isActivated } }) => (
            <Checkbox checked={isActivated} />
        ),
    },
];
