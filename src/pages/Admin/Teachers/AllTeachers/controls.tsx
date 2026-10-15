import React, { useState } from 'react';
import EditCard from '../EditTeacher';

function Controls({ teacher, onSave }) {
    const [isEdit, setIsEdit] = useState(false);

    const handleEdit = (bool) => setIsEdit(bool);

    return (
        <>
            {isEdit && (
                <Grid item key={teacher.id} xs={12} sm={12} lg={12}>
                    <Card flex alignItems="end">
                        <EditCard
                            teacher={teacher}
                            onSave={onSave}
                            onCancel={() => setIsEdit(false)}
                        />
                    </Card>
                </Grid>
            )}
            {!isEdit && (
                <Grid item key={teacher.id} xs={12} sm={12} lg={6}>
                    <Card teacher={teacher} />
                    <Button variant="outlined" onClick={() => handleEdit(true)}>
                        Edit
                    </Button>
                </Grid>
            )}
        </>
    );
}

export default Controls;
