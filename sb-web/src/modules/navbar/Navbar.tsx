import React, { FunctionComponent, useEffect, useState } from 'react';

import { Box, Button, Flex, IconButton, HStack } from '@chakra-ui/react';

import { ReactComponent as Logo } from 'assets/sailboat-logo.svg';
import { Menu } from 'components/menu/Menu';
import { UnAuthenticatedNavbar } from 'modules/navbar/UnauthenticatedNavbar';
import { Notification } from 'modules/notifications/Notification';
import { ProfileIcon } from 'profile/profile-icon/ProfileIcon';
import { Routes } from 'router/Router.Types';
import { SbClockIcon, SbFeedIcon, SbBoatIcon, SbPlusIcon } from 'util/icons/Icons';

import 'modules/navbar/Navbar.scss';

interface Props {
    isAuth: boolean;
}

export const Navbar: FunctionComponent<Props> = ({ isAuth }) => {
    const [navbarBg, setNavbarBg] = useState<boolean>(false);

    useEffect(() => {
        document.addEventListener('scroll', () => {
            if (window.scrollY < 10) {
                setNavbarBg(false);
            } else {
                setNavbarBg(true);
            }
        });
    }, []);

    const onRoute = (path: string) => {
        if (window.location.pathname !== path) window.location.href = path;
    };

    return (
        <Flex
            className="sb-navbar"
            justifyContent="space-between"
            alignItems="center"
            px={{ base: '4', sm: '8' }}
            bg={navbarBg ? 'white' : 'transparent'}
            transition="all 0.25s ease-in-out"
            boxShadow={navbarBg ? 'sm' : 'none'}
        >
            {isAuth ? (
                <>
                    <HStack alignItems="center" spacing="4">
                        <Logo className="logo" onClick={() => onRoute(Routes.Private.Home)} />
                        <Box display={{ base: 'none', md: 'flex' }}>
                            <Button
                                variant={window.location.pathname === Routes.Private.Home ? 'solid' : 'ghost'}
                                colorScheme="gray"
                                leftIcon={<SbBoatIcon />}
                                onClick={() => onRoute(Routes.Private.Home)}
                            >
                                Boats
                            </Button>
                            <Button variant="ghost" colorScheme="gray" leftIcon={<SbFeedIcon />}>
                                Feed
                            </Button>
                            <Button variant="ghost" colorScheme="gray" leftIcon={<SbClockIcon />}>
                                Memories
                            </Button>
                        </Box>
                    </HStack>
                    <HStack alignItems="center">
                        <Button
                            leftIcon={<SbPlusIcon />}
                            onClick={() => onRoute(Routes.Private.Create)}
                            display={{ base: 'none', md: 'block' }}
                        >
                            Start Boat
                        </Button>
                        <Notification display={{ base: 'none', md: 'block' }} />
                        <ProfileIcon display={{ base: 'none', md: 'block' }} />

                        {/* MOBILE NAV ITEMS START */}

                        <IconButton aria-label="add" icon={<SbPlusIcon />} display={{ base: 'flex', md: 'none' }} />
                        <Menu display={{ base: 'block', md: 'none' }} />

                        {/* MOBILE NAV ITEMS END */}
                    </HStack>
                </>
            ) : (
                <UnAuthenticatedNavbar navbarBg={navbarBg} onRoute={onRoute} />
            )}
        </Flex>
    );
};
