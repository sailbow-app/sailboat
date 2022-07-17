import React, { FunctionComponent } from 'react';

import { Box, Flex, Heading, Stack, StackDivider, Text, Link, HStack, IconButton, Tooltip } from '@chakra-ui/react';

import { ReactComponent as IconLogoType } from 'assets/icon-logo-type.svg';
import { SingleSelect } from 'shared/select/Select';
import { Subscribe } from 'shared/footer/Subscribe';
import { SbFacebookIcon, SbInstagramIcon, SbGitHubIcon } from 'util/icons/Icons';
import { Routes } from 'router/Router.Types';

const Languages = [
    {
        label: 'English (US)',
        value: 'en_US',
    },
];

const FooterSections = [
    {
        heading: 'Product',
        content: [
            {
                label: 'About Us',
                href: Routes.Whitelisted.AboutUs,
            },
            {
                label: 'How it works',
                href: Routes.Whitelisted.HowItWorks,
            },
            {
                label: 'FAQ',
                href: Routes.Whitelisted.FAQ,
            },
            {
                label: 'Contact',
                href: Routes.Whitelisted.Contact,
            },
        ],
    },
    {
        heading: 'Legal',
        content: [
            {
                label: 'Privacy',
                href: Routes.Whitelisted.Privacy,
            },
            {
                label: 'Terms',
                href: Routes.Whitelisted.Terms,
            },
            {
                label: 'License',
                href: Routes.Whitelisted.License,
            },
        ],
    },
];

export const Footer: FunctionComponent = () => {
    return (
        <Box as="footer" role="contentinfo" mx="auto" pt="12" pb="10" px={{ base: '4', md: '8' }}>
            <Stack spacing="10" divider={<StackDivider />}>
                <Stack direction={{ base: 'column', lg: 'row' }} spacing={{ base: '10', lg: '28' }}>
                    <Box flex="1">
                        <IconLogoType width="150px" />
                        <HStack spacing="4">
                            <IconButton colorScheme="gray" aria-label="instagram" fontStyle="xxl" borderRadius="xl">
                                <SbInstagramIcon />
                            </IconButton>
                            <IconButton colorScheme="gray" aria-label="instagram" fontStyle="xxl" borderRadius="xl">
                                <SbFacebookIcon />
                            </IconButton>
                            <IconButton colorScheme="gray" aria-label="instagram" fontStyle="xxl" borderRadius="xl">
                                <SbGitHubIcon />
                            </IconButton>
                        </HStack>
                    </Box>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: '10', md: '20' }}>
                        {FooterSections.map((section) => (
                            <Box key={section.heading}>
                                <Heading size="sm" textTransform="uppercase" letterSpacing="wider" color="gray.400">
                                    {section.heading}
                                </Heading>
                                <Flex textAlign="start" flexDir="column" pt="4">
                                    {section.content.map((route) => (
                                        <Link href={route.href} key={route.label}>
                                            {route.label}
                                        </Link>
                                    ))}
                                </Flex>
                            </Box>
                        ))}
                        <Subscribe />
                    </Stack>
                </Stack>
                <Stack
                    direction={{ base: 'column-reverse', md: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Text fontSize="sm">&copy; {new Date().getFullYear()} Sailboat, Inc. All rights reserved.</Text>
                    <Stack
                        direction={{ base: 'column-reverse', md: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Flex alignItems="center" fontSize="sm">
                            <Text pr="2" fontWeight="normal">
                                Language & Region:{' '}
                            </Text>
                            <SingleSelect
                                isSearchable={false}
                                options={Languages}
                                defaultValue={Languages[0]}
                                onChange={(e: any) => {
                                    console.log('Language Selected', e.label);
                                }}
                            />
                        </Flex>
                        <Flex alignItems="center" fontSize="sm" pl={{ base: '0', md: '2' }}>
                            <Text pr="2" fontWeight="normal">
                                Status
                            </Text>
                            <Tooltip label="Active">
                                <Box h="10px" w="10px" bg="brand.success" borderRadius="50%" />
                            </Tooltip>
                        </Flex>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};
