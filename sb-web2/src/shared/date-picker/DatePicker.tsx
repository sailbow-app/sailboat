import { FC, useEffect, useState } from 'react';

import {
    Box,
    Flex,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    IconButton,
    TableContainer,
    Stack,
} from '@chakra-ui/react';
import { SbChevronDownIcon, SbChevronLeftIcon, SbChevronRightIcon, SbChevronUpIcon } from 'shared/icons/Icons';

const Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
enum Weekday {
    Sunday = 'Sun',
    Monday = 'Mon',
    Tuesday = 'Tue',
    Wednesday = 'Wed',
    Thursday = 'Thu',
    Friday = 'Fri',
    Saturday = 'Sat',
}

enum DatePickerMode {
    Calendar,
    MonthYear,
}

const WeekdayArray = [
    Weekday.Sunday,
    Weekday.Monday,
    Weekday.Tuesday,
    Weekday.Wednesday,
    Weekday.Thursday,
    Weekday.Friday,
    Weekday.Saturday,
];

interface Props {
    date: string;
    onChange: (date: string) => void;
}

const getAllDaysInMonth = (month: number, year: number) =>
    Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => new Date(year, month - 1, i + 1));

const getYear = (date: string) => {
    return new Date(date).getFullYear();
};

const getMonth = (date: string) => {
    return new Date(date).getMonth() + 1;
};

const getNextYearRange = (year: number) => {
    return [0, 1, 2, 3, 4, 5, 6].map((x) => year + x);
};

const YearRange = getNextYearRange(new Date().getFullYear());

interface Calander {
    label: string;
    id: string;
}

export const DatePicker: FC<Props> = ({ date, onChange }) => {
    const [selectedDate, setSelectedDate] = useState<string>(date || new Date().toLocaleDateString());
    const [year, setYear] = useState<number>(getYear(selectedDate));
    const [month, setMonth] = useState<number>(getMonth(selectedDate));
    const [calendar, setCalendar] = useState<Calander[][]>([]);
    const [mode, setMode] = useState<DatePickerMode>(DatePickerMode.Calendar);

    useEffect(() => {
        generateCalendar(year, month);
    }, [year, month]);

    const generateCalendar = (y: number, m: number) => {
        const allDatesInMonth = getAllDaysInMonth(m, y);
        const calendar: Calander[][] = [];
        let row: Calander[] = Array.from({ length: 7 }).map((x, i) => ({ label: '', id: `r1-${i}` }));
        let dayCount = 1;

        allDatesInMonth.forEach((date) => {
            const localizedDate = date.toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' });
            const dayIndex = WeekdayArray.indexOf(localizedDate.split(',')[0] as Weekday);

            row[dayIndex] = {
                id: date.toLocaleDateString(),
                label: dayCount.toString(),
            };
            dayCount += 1;

            if (dayIndex === 6) {
                calendar.push(row);
                row = [];
            }
        });

        if (row.length) calendar.push(row);

        setCalendar(calendar);
    };

    const onSelect = (date: string) => {
        setSelectedDate(date);
        setYear(getYear(date));
        setMonth(getMonth(date));
        onChange(date);
    };

    const onNextMonth = () => {
        let nextMonth = month + 1;
        let updatedYear = year;

        if (nextMonth > 11) {
            nextMonth = 1;
            updatedYear += 1;
        }

        setYear(updatedYear);
        setMonth(nextMonth);
    };

    const onPrevMonth = () => {
        let updatedMonth = month - 1;
        let updatedYear = year;

        if (updatedMonth < 1) {
            updatedMonth = 12;
            updatedYear -= 1;
        }

        setYear(updatedYear);
        setMonth(updatedMonth);
    };

    const toggleMode = () => {
        if (mode === DatePickerMode.Calendar) setMode(DatePickerMode.MonthYear);
        else setMode(DatePickerMode.Calendar);
    };

    return (
        <Box maxH="260px">
            <Flex w="100%" py="2" justifyContent="space-between" alignItems="center">
                <IconButton
                    fontSize="xl"
                    aria-label="settings"
                    colorScheme="gray"
                    variant="ghost"
                    icon={<SbChevronLeftIcon />}
                    onClick={onPrevMonth}
                />
                <Button
                    colorScheme="gray"
                    variant="ghost"
                    rightIcon={mode === DatePickerMode.Calendar ? <SbChevronDownIcon /> : <SbChevronUpIcon />}
                    onClick={toggleMode}
                >
                    {new Date(`${year}/${month}`).toLocaleString('en-us', { month: 'long' })} {year}
                </Button>

                <IconButton
                    fontSize="xl"
                    aria-label="settings"
                    colorScheme="gray"
                    variant="ghost"
                    icon={<SbChevronRightIcon />}
                    onClick={onNextMonth}
                />
            </Flex>

            <Flex w="100%" display={mode === DatePickerMode.Calendar ? 'none' : 'flex'} justifyContent="space-between">
                <Stack maxH="260px" overflowY="auto" w="100%" p="2">
                    {Months.map((m) => (
                        <Button
                            variant={m === Months[month - 1] ? 'solid' : 'ghost'}
                            colorScheme={m === Months[month - 1] ? 'brand' : 'gray'}
                            key={`month-${m}`}
                            onClick={() => setMonth(Months.indexOf(m))}
                        >
                            {m}
                        </Button>
                    ))}
                </Stack>
                <Stack maxH="260px" overflowY="auto" w="100%" p="2">
                    {YearRange.map((y) => (
                        <Button
                            variant={y === year ? 'solid' : 'ghost'}
                            colorScheme={y === year ? 'brand' : 'gray'}
                            key={`year-${y}`}
                            onClick={() => {
                                setYear(y);
                                setMode(DatePickerMode.Calendar);
                            }}
                        >
                            {y}
                        </Button>
                    ))}
                </Stack>
            </Flex>

            <TableContainer w="300px">
                <Table size="xs" display={mode === DatePickerMode.Calendar ? 'table' : 'none'}>
                    <Thead>
                        <Tr fontSize="xs">
                            {WeekdayArray.map((weekday) => (
                                <Th border="none" key={weekday} textAlign="center">
                                    {weekday[0]}
                                </Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {calendar.map((row, idx) => (
                            <Tr key={`row-${idx}`} border="none">
                                {row.map((day) => (
                                    <Td p="0" key={day.id} border="none" textAlign="center">
                                        {day.label && (
                                            <Button
                                                w="40px"
                                                h="40px"
                                                p="0"
                                                fontSize="sm"
                                                onClick={() => {
                                                    if (day.id !== selectedDate) onSelect(day.id);
                                                }}
                                                variant={day.id === selectedDate ? 'solid' : 'ghost'}
                                                colorScheme={day.id === selectedDate ? 'brand' : 'gray'}
                                            >
                                                {day.label}
                                            </Button>
                                        )}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};
