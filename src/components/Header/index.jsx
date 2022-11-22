import { Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import Theme from '../Theme';
import React from 'react';
import { useContext } from 'react';
import { LayoutContext } from '../../context/layout';

const Header = () => {
    const [headerState] = useContext(LayoutContext);

    return (
        headerState.isShown && (
            <header className="header">
                <Box
                    display="flex"
                    justifyContent="space-around"
                    alignItems="center"
                >
                    <ul className="header__list">
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            gap={4}
                            margin={2}
                        >
                            {headerState.links.map((link, index) => (
                                <Link
                                    underline="none"
                                    to={link.path}
                                    key={index}
                                    component={RouterLink}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <li className="header__link">
                                <Theme />
                            </li>
                        </Box>
                    </ul>
                </Box>
            </header>
        )
    );
};

export default Header;
