import { useLoaderData } from 'react-router-dom';
import Accordion from '../../components/Accordion';
import {
    StyledAccordionDetails,
    StyledAccordionSummary,
} from '../../components/Accordion/styles';
import MassageService from '../../services/Massage';

export default function Massage() {
    const loaderData = useLoaderData();

    return (
        <Card flex justifyContent="center" alignItems="center" gap={2}>
            <p variant={'h3'}>{loaderData.title}</p>
            <Card width="50%">
                {loaderData.technics.map((technic) => (
                    <Accordion key={technic._id}>
                        <StyledAccordionSummary
                            expandIcon={
                                technic.grips.length > 0 ? (
                                    <ExpandMoreOutlined />
                                ) : (
                                    false
                                )
                            }
                        >
                            <p textTransform={'capitalize'}>{technic.title}</p>
                        </StyledAccordionSummary>
                        {technic.grips.length > 0 && (
                            <StyledAccordionDetails>
                                {technic.grips.map((grip) => (
                                    <p key={grip._id}>{technic.title}</p>
                                ))}
                            </StyledAccordionDetails>
                        )}
                    </Accordion>
                ))}
            </Card>
        </Card>
    );
}

export const loader = async ({ params }) => {
    const { id } = params;
    const request = await MassageService.getMassage(id);

    return request.payload;
};
