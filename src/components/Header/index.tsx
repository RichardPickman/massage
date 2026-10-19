import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { AccountMenu } from '../AccountMenu';
import { Button } from '../ui/button';
import { auth, paths } from './paths';

const Header = () => {
    const { isAuth } = useAppSelector((state) => state.auth);

    return (
        <header className="flex items-center justify-between py-2 px-4">
            <p className="text-lg">RP</p>
            <div className="flex gap-2">
                {paths.map((elem, index) => {
                    if (!elem.authRequired) {
                        return (
                            <Button key={index}>
                                <Link to={elem.path}>{elem.name}</Link>
                            </Button>
                        );
                    }

                    if (elem.authRequired) {
                        return isAuth ? (
                            <Button key={index}>
                                <Link to={elem.path}>{elem.name}</Link>
                            </Button>
                        ) : null;
                    }
                })}
            </div>
            <div className="flex gap-2">
                {isAuth ? (
                    <AccountMenu />
                ) : (
                    auth.map((link, index) => (
                        <Button key={index} variant="link">
                            <Link to={link.path}>{link.name}</Link>
                        </Button>
                    ))
                )}
            </div>
        </header>
    );
};

export default Header;
