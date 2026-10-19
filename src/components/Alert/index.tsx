import { Alert as AlertPrimitive } from '@/components/ui/alert';
import { alertStatuses } from '../../utils/consts';

interface AlertProps {
    status: (typeof alertStatuses)[keyof typeof alertStatuses];
    text: string;
}

export const Alert = ({ status, text }: AlertProps) => {
    if (status === alertStatuses.FAIL) {
        return <AlertPrimitive variant="destructive">{text}</AlertPrimitive>;
    }

    return <AlertPrimitive>{text}</AlertPrimitive>;
};
