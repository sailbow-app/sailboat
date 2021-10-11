import React, { FunctionComponent, useState } from 'react';

import { Box, Image, Button, IconButton, Text } from '@chakra-ui/react';

import { BoatActionType, useBoat } from 'contexts/boat/Boat';
import { BannerType } from 'contexts/boat/BoatConstants';
import { BannerChangeModal } from 'modules/banner/banner-change-modal/BannerChangeModal';
import { Color } from 'theme/Colors';
import { ArrowDown, ArrowUp, Pencil } from 'util/Icons';

import 'modules/banner/Banner.scss';

export const Banner: FunctionComponent = () => {
    const [boat, dispatch] = useBoat();
    const [isBannerSelectOpen, setIsBannerSelectOpen] = useState<boolean>(false);
    const [bannerPosition, setBannerPosition] = useState<number>(boat.banner.position || 50);

    const onSubmit = (type: BannerType, value: string | Color) => {
        dispatch({
            type: BoatActionType.SetDetails,
            payload: { ...boat, banner: { type, value, position: bannerPosition } },
        });
    };

    const setPosition = (dir: 'up' | 'down') => {
        let newPosition = bannerPosition;

        switch (dir) {
            case 'down':
                if (bannerPosition < 90) {
                    newPosition = bannerPosition + 10;
                }
                break;
            case 'up':
                if (bannerPosition > 10) {
                    newPosition = bannerPosition - 10;
                }
                break;
            default:
                throw new Error(`Invalid direction - ${dir}`);
        }

        setBannerPosition(newPosition);
        dispatch({
            type: BoatActionType.SetDetails,
            payload: { ...boat, banner: { ...boat.banner, position: newPosition } },
        });
    };

    return (
        <>
            <BannerChangeModal
                isOpen={isBannerSelectOpen}
                onClose={() => setIsBannerSelectOpen(!isBannerSelectOpen)}
                onChange={onSubmit}
                banner={boat.banner}
            />
            <Box className="sb-banner" borderRadius="xl" overflow="hidden">
                <Button
                    size="sm"
                    className="sb-banner-button"
                    colorScheme="gray"
                    borderRadius="lg"
                    rightIcon={<Pencil />}
                    onClick={() => setIsBannerSelectOpen(!isBannerSelectOpen)}
                >
                    <Text pr="2">Change Banner</Text>
                </Button>
                {boat.banner.type === BannerType.Color ? (
                    <Box bg={boat.banner.value} className="sb-banner-image" />
                ) : (
                    <>
                        <IconButton
                            bg="white"
                            aria-label="edit-button-up"
                            className="edit-button-up"
                            size="xs"
                            colorScheme="gray"
                            borderRadius="md"
                            onClick={() => setPosition('up')}
                        >
                            <ArrowUp />
                        </IconButton>
                        <IconButton
                            bg="white"
                            aria-label="edit-button-down"
                            className="edit-button-down"
                            size="xs"
                            colorScheme="gray"
                            borderRadius="md"
                            onClick={() => setPosition('down')}
                        >
                            <ArrowDown />
                        </IconButton>
                        <Image
                            draggable="false"
                            objectPosition={`left ${bannerPosition}%`}
                            src={boat.banner.value}
                            className="sb-banner-image"
                        />
                    </>
                )}
            </Box>
        </>
    );
};
