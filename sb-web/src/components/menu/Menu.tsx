import React, { FunctionComponent } from 'react';

import {
    Box,
    Avatar,
    Flex,
    Divider,
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import {
    SbBellIcon,
    SbBoatIcon,
    SbClockIcon,
    SbCloseIcon,
    SbFeedIcon,
    SbLogoutIcon,
    SbMailIcon,
    SbMenuIcon,
    SbPrivacyIcon,
    SbQuestionIcon,
    SbTermsIcon,
} from 'util/icons/Icons';

import 'components/menu/Menu';
import { useProfile } from 'profile/Profile';
import { Routes } from 'router/Router.Types';

const groups = [
    {
        groupName: 'Menu',
        items: [
            {
                label: 'Boats',
                route: Routes.Private.Home,
                icon: <SbBoatIcon />,
            },
            {
                label: 'Feed',
                route: Routes.Private.Home,
                icon: <SbFeedIcon />,
            },
            {
                label: 'Memories',
                route: Routes.Private.Home,
                icon: <SbClockIcon />,
            },
        ],
    },
    {
        groupName: 'Help',
        items: [
            {
                label: 'Privacy',
                route: Routes.Whitelisted.Privacy,
                icon: <SbPrivacyIcon />,
            },
            {
                label: 'Terms',
                route: Routes.Whitelisted.Terms,
                icon: <SbTermsIcon />,
            },
            {
                label: 'FAQ',
                route: Routes.Whitelisted.FAQ,
                icon: <SbQuestionIcon />,
            },
            {
                label: 'Contact',
                route: Routes.Whitelisted.Contact,
                icon: <SbMailIcon />,
            },
        ],
    },
];

interface Props {
    display: any;
}

interface MenuItemProps {
    icon: JSX.Element;
    text: string;
}

export const Menu: FunctionComponent<Props> = ({ display }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [{ profile }] = useProfile();

    const MenuItem: FunctionComponent<MenuItemProps> = ({ icon, text }) => {
        return (
            <Flex alignItems="center" py="2" px="4" _active={{ bgColor: 'gray.200' }}>
                <span>{icon}</span>
                <Text pl="2" fontWeight="normal">
                    {text}
                </Text>
            </Flex>
        );
    };

    return (
        <Box display={display}>
            <IconButton aria-label="menu" variant="icon" icon={<SbMenuIcon />} onClick={onOpen} />
            <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent className="sb-menu">
                    <DrawerHeader border="0" pb="0" pr="2" pt="2" textAlign="right">
                        <IconButton aria-label="close" variant="icon" icon={<SbBellIcon />} fontSize="xl" />
                        <IconButton
                            aria-label="close"
                            variant="icon"
                            icon={<SbCloseIcon />}
                            fontSize="2xl"
                            onClick={onClose}
                        />
                    </DrawerHeader>
                    <DrawerBody p="0">
                        <Flex alignItems="center" p="4" _active={{ bgColor: 'gray.100' }}>
                            <Avatar name={profile?.name} />
                            <Box pl="4">
                                <Text fontWeight="semibold">{profile?.name}</Text>
                                <Text fontWeight="normal" fontSize="sm">
                                    {profile?.email}
                                </Text>
                            </Box>
                        </Flex>
                        <Divider />
                        <Box pt="4">
                            {groups.map((menu) => (
                                <Box py="2" key={menu.groupName}>
                                    <Text fontWeight="semibold" fontSize="sm" pl="4" pb="2">
                                        {menu.groupName}
                                    </Text>
                                    {menu.items.map((item) => (
                                        <MenuItem key={item.label} icon={item.icon} text={item.label} />
                                    ))}
                                </Box>
                            ))}
                        </Box>
                        <Box position="absolute" bottom="0" w="100%">
                            <Divider />
                            <MenuItem icon={<SbLogoutIcon />} text="Logout" />
                        </Box>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};
