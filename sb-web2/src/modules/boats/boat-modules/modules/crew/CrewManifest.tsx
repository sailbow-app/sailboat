import { FC } from 'react';

import { Button, Flex } from '@chakra-ui/react';

import { BoatManifest } from 'modules/boats/common/boat-manifest/BoatManifest';
import { SbPlusIcon, SbUserGroup } from 'shared/icons/Icons';
import { Boat, Role } from 'modules/boats/Boat.Types';
import { CrewGroup } from 'shared/crew/crew-group/CrewGroup';
import { useSystem } from 'modules/system/System.Store';
import { withRoleGuard } from 'shared/role/RoleGuard';

interface Props {
    boat: Boat;
}

const GuardedInviteButton = withRoleGuard(Button);

export const CrewManifest: FC<Props> = ({ boat }) => {
    const [, { openCrewNav, openCrewInviteModal }] = useSystem();

    return (
        <BoatManifest icon={<SbUserGroup />} label={`Crew (${boat.crew.length})`} finalized="Crew">
            <Flex w="100%" justifyContent="space-between" alignItems="center">
                <CrewGroup crew={boat.crew} onClick={openCrewNav} />
                <Flex gap="2" display={boat.role === Role.Captain ? 'flex' : 'none'}>
                    <GuardedInviteButton
                        size="sm"
                        rightIcon={<SbPlusIcon />}
                        variant="secondary"
                        colorScheme="gray"
                        onClick={openCrewInviteModal}
                        role={boat.role}
                        acceptedRoles={[Role.Captain, Role.Assistant]}
                    >
                        Invite
                    </GuardedInviteButton>
                </Flex>
            </Flex>
        </BoatManifest>
    );
};
