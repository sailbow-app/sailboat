import React, { FunctionComponent } from 'react';

import { Box, Flex, Heading } from '@chakra-ui/react';

import { AuthCard } from 'modules/auth/auth-card/AuthCard';
import { Routes } from 'router/Router.Types';

import 'auth/redirect/Redirect.scss';

export const Redirect: FunctionComponent = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const path: string | null = urlSearchParams.get('path');

    if (!path) {
        window.location.href = Routes.Public.Landing;
    }

    return (
        <Box className="sb-redirect">
            {path && (
                <>
                    <Heading pb="16">Please log in to go there!</Heading>
                    <Flex justifyContent="center" alignItems="center">
                        <AuthCard path={path} />
                    </Flex>
                </>
            )}
        </Box>
    );
};
