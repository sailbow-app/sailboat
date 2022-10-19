import React, { FunctionComponent, useEffect } from 'react';

import { Box, Flex, Button } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useBoat } from 'modules/boats/Boat.Store';
import { BoatTabs } from 'modules/boats/view/boat-tabs/BoatTabs';
import { Details } from 'modules/boats/view/details/Details';
import { Toolbar } from 'modules/boats/view/toolbar/Toolbar';
import { Loading } from 'shared/loading/Loading';
import { Boat } from 'modules/boats/Boat.Types';
import { SbPlusIcon } from 'util/icons/Icons';

export const BoatView: FunctionComponent = () => {
    const [{ boat, loading, error }, { getBoat }] = useBoat();
    const { boatId } = useParams<{ boatId: string }>();

    useEffect(() => {
        (async () => {
            await getBoat(boatId);
        })();
    }, []); // eslint-disable-line

    const BoatRenderer: FunctionComponent<{ data: Boat }> = ({ data }) => {
        return (
            <Box p={{ base: 0, md: 4 }}>
                <Toolbar boat={data} />

                <Flex>
                    <Box flex={{ base: '1', md: '0.8' }} pr={{ base: 0, md: 8 }}>
                        <BoatTabs />
                    </Box>
                    <Box flex="0.2" display={{ base: 'none', md: 'block' }}>
                        <Details boat={data} />
                    </Box>
                </Flex>

                <Button
                    colorScheme="brand"
                    rightIcon={<SbPlusIcon />}
                    ml="4"
                    position="fixed"
                    bottom="16px"
                    right="16px"
                >
                    Add Widgets
                </Button>
            </Box>
        );
    };

    return boat && !loading.get && !error ? <BoatRenderer data={boat} /> : <Loading />;
};
