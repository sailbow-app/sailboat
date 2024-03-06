import { FunctionComponent, ReactElement, useEffect } from 'react';

import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';

import { ReactComponent as Logo } from 'assets/sailboat-logo.svg';
import { SbRightArrowIcon } from 'shared/icons/Icons';
import { LocalStorageKeys, LS } from 'util/localstorage/LocalStorage';

import './Base.scss';

interface Props {
    children: ReactElement | ReactElement[];
    title: string;
    docTitle?: string;
    subtitle?: string;
}

export const BaseNavbar: FunctionComponent = () => {
    const toHome = (): void => {
        window.location.href = '/';
    };

    const displayLabel = (): string => {
        if (LS.getItem(LocalStorageKeys.AT)) {
            return 'Continue Sailing';
        }
        return 'Start Sailing';
    };

    return (
        <Flex
            bg="white"
            justifyContent="space-between"
            px={{ base: '4', sm: '8' }}
            alignItems="center"
            className="sb-base-navbar"
            boxShadow="sm"
        >
            <Logo className="logo" onClick={toHome} />
            <Button rightIcon={<SbRightArrowIcon />} onClick={toHome}>
                <Text pr="4">{displayLabel()}</Text>
            </Button>
        </Flex>
    );
};

export const Base: FunctionComponent<Props> = ({ title, children, subtitle, docTitle }) => {
    useEffect(() => {
        const dt = document.title;
        document.title = `${dt} | ${docTitle || title}`;
    });

    return (
        <>
            <Box className="container sb-base" my={{ base: '10', md: '12' }}>
                <Heading fontSize={{ base: '4xl', md: '5xl' }}>{title}</Heading>
                {subtitle && <Text fontWeight="normal">{subtitle}</Text>}
                <Box pt="16">{children}</Box>
            </Box>
        </>
    );
};

Base.defaultProps = {
    subtitle: '',
    docTitle: '',
};
