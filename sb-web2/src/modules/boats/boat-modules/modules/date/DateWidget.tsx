import { ChangeEvent, FC, useState } from 'react';

import { BoatWidget, WidgetProps } from 'modules/boats/common/boat-widget/BoatWidget';
import { DateWidgetSettings } from './DateWidgetSettings';
import { WidgetData } from 'modules/boats/Boat.Types';
import { Poll } from 'shared/poll/Poll';
import { Flex, Skeleton } from '@chakra-ui/react';
import { Input } from 'shared/input/Input';
import { useAuthStore } from 'modules/auth/Auth.Store';
import { useBoat } from 'modules/boats/Boat.Store';

export interface DateWidgetData extends WidgetData {
    startDate: string;
    endDate?: string;
}

interface Props extends WidgetProps {
    data: DateWidgetData[];
}

export const DateWidget: FC<Props> = ({ id, name, loading, data, mode }) => {
    const [widgetData, setWidgetData] = useState<DateWidgetData[]>(data);
    const [optionsCounter, setOptionsCounter] = useState<number>(0);
    const [formError, setFormError] = useState<boolean>();
    const [{ user }] = useAuthStore();
    const [, { saveModuleData }] = useBoat();

    const onDataChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const updatedWidgetData = [...widgetData];
        const idx = updatedWidgetData.findIndex((w) => w.id === id);

        if (idx !== -1) {
            updatedWidgetData[idx][e.target.name as 'startDate' | 'endDate'] = e.target.value;
        }

        setWidgetData([...updatedWidgetData]);
    };

    const onSave = () => {
        const updatedWidgetData = [...widgetData];
        setFormError(false);
        let hasError = false;

        widgetData.forEach((d) => {
            const foundPollIdx = updatedWidgetData.findIndex((i) => i.id === d.id);

            if (!updatedWidgetData[foundPollIdx].startDate) {
                setFormError(true);
                hasError = true;
                return false;
            }

            if (foundPollIdx !== -1) {
                updatedWidgetData[foundPollIdx].isEditing = false;
                updatedWidgetData[foundPollIdx].text = `${d.startDate} ${d.endDate ? `- ${d.endDate}` : ''}`;
            }
        });

        if (hasError) return;

        setWidgetData([...updatedWidgetData]);
        saveModuleData<DateWidgetData[]>(id, widgetData);
    };

    const onRemoveOption = (optionId: string) => {
        const updatedWidgetdata = [...widgetData];
        const optionIdx = updatedWidgetdata.findIndex((w) => w.id === optionId);

        if (optionIdx !== -1) {
            updatedWidgetdata.splice(optionIdx, 1);
        }

        setWidgetData([...updatedWidgetdata]);
    };

    const getInputComponent: any = (optionId: string, data: DateWidgetData) => {
        return (
            <Flex w="100%" gap="4" flexDir={{ base: 'column', md: 'row' }}>
                <Input
                    label="Start Date"
                    type="date"
                    name="startDate"
                    required
                    onChange={onDataChange(optionId)}
                    value={data.startDate}
                    error={formError}
                    errorLabel="Start date is required"
                />
                <Input
                    label="End Date"
                    type="date"
                    name="endDate"
                    onChange={onDataChange(optionId)}
                    value={data.endDate}
                />
            </Flex>
        );
    };

    return (
        <BoatWidget
            id={id}
            name={name}
            settings={<DateWidgetSettings />}
            onSave={onSave}
            mode={mode}
            data={widgetData || []}
        >
            {!loading ? (
                <Poll
                    mode={mode}
                    data={widgetData}
                    getInputComponent={getInputComponent}
                    onAddClick={() => {
                        const newData: DateWidgetData = {
                            id: (optionsCounter + 1).toString(),
                            author: { id: user?.id!, name: user!.name, email: user!.email },
                            text: '',
                            selected: false,
                            votes: 0,
                            isEditing: true,
                            startDate: '',
                            endDate: '',
                        };
                        setWidgetData([...widgetData, newData]);
                        setOptionsCounter(optionsCounter + 1);
                    }}
                    onOptionEdit={(optionId: string) => {
                        const newOptions = [...widgetData];
                        const optionIdx = newOptions.findIndex((p) => p.id === optionId);

                        if (optionIdx !== -1) {
                            newOptions[optionIdx].isEditing = true;
                        }
                        setWidgetData([...newOptions]);
                    }}
                    onRemoveOption={onRemoveOption}
                />
            ) : (
                <Skeleton h="106px" startColor="gray.100" endColor="gray.300" />
            )}
        </BoatWidget>
    );
};
