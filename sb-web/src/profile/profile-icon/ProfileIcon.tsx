import React, { FunctionComponent } from 'react';

import { Avatar, Box, Menu, MenuButton, MenuItem, MenuGroup, MenuDivider, MenuList } from '@chakra-ui/react';

import { useProfile } from 'profile/Profile';
import { Http, resetLocalStorage } from 'util/http/Http';
import {
    SbQuestionIcon,
    SbPrivacyIcon,
    SbTermsIcon,
    SbUserIcon,
    SbLogoutIcon,
    SbMailIcon,
    SbBugIcon,
} from 'util/icons/Icons';
import { Routes } from 'router/Router.Types';

import 'profile/profile-icon/ProfileIcon.scss';
import { AuthEndpoints } from 'modules/auth/Auth.Service';

const HelpOptions = [
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
    {
        label: 'Report Bug',
        route: Routes.Whitelisted.Contact,
        icon: <SbBugIcon />,
    },
];

interface Props {
    display: any;
}

export const ProfileIcon: FunctionComponent<Props> = ({ display }) => {
    const [{ profile }] = useProfile();

    const onLogout = async () => {
        await Http(AuthEndpoints.Logout());
        resetLocalStorage();
        window.location.href = Routes.Public.Landing;
    };

    const onRoute = (route: string) => {
        window.location.href = route;
    };

    return (
        <Box className="sb-profile-icon" display={display}>
            <Menu>
                <MenuButton className="button">
                    <Avatar name={profile?.name} size="sm" h="40px" w="40px" />
                </MenuButton>
                <MenuList fontWeight="normal">
                    <MenuGroup title="Profile">
                        <MenuItem icon={<SbUserIcon height="20px" />}>My Profile</MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup title="Help">
                        {HelpOptions.map(({ label, icon, route }) => (
                            <MenuItem key={label} icon={icon} onClick={() => onRoute(route)}>
                                {label}
                            </MenuItem>
                        ))}
                    </MenuGroup>
                    <MenuDivider />
                    <MenuItem icon={<SbLogoutIcon />} onClick={onLogout}>
                        Logout
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
};
