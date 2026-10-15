import { Card } from '@/components/ui/card';
import { imageURL } from '../../../../utils/consts';

function ShowCard({ teacher }) {
    const image = teacher.img ? teacher.img : imageURL;

    return (
        <Card>
            <p>
                {teacher.firstName} {teacher.lastName}
            </p>
            <Card>
                <img src={image} />
                <Card>
                    <Stack>
                        <p>Email:</p>
                        <p color="#71aaeb">{teacher.email}</p>
                    </Stack>
                    <Stack>
                        <p>Lessons:</p>
                        <Card>
                            {teacher.lessons.map((lesson) => (
                                <p key={lesson.id}>{lesson.title}</p>
                            ))}
                        </Card>
                    </Stack>
                </Card>
            </Card>
        </Card>
    );
}

export default Card;
