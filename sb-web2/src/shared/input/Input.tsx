import { forwardRef, FunctionComponent, ReactNode } from 'react';

import {
    InputGroup,
    Input as ChakraInput,
    InputRightElement,
    Tooltip,
    InputProps as ChakraInputProps,
    TextareaProps as ChakraTextareaProps,
    Textarea,
    Spinner,
    Box,
    InputLeftAddon,
} from '@chakra-ui/react';

import { SbErrorCircleIcon } from 'shared/icons/Icons';
import { Label } from './Label';

import './Input.scss';

export interface InputProps extends ChakraInputProps {
    loading?: boolean;
    field?: any;
    error?: boolean;
    errorLabel?: string;
    errorIcon?: JSX.Element;
    label?: string;
    required?: boolean;
    customClass?: string;
    leftIcon?: ReactNode;
    rightIconButton?: ReactNode;
}

interface TextareaProps extends ChakraTextareaProps {
    loading?: boolean;
    field?: any;
    error?: boolean;
    errorLabel?: string;
    errorIcon?: JSX.Element;
    label?: string;
    required?: boolean;
    customClass?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            field,
            error,
            errorLabel,
            errorIcon,
            loading,
            required,
            customClass,
            leftIcon,
            rightIconButton,
            ...props
        },
        ref,
    ) => {
        return (
            <Box className={`sb-input-wrapper ${customClass}`} w="100%" ref={ref}>
                {label && <Label label={label} required={required} />}
                <InputGroup variant="brand" alignItems="center" className="sb-input">
                    <InputLeftAddon position="absolute" p="0" color="brand.secondary">
                        {leftIcon}
                    </InputLeftAddon>
                    {rightIconButton && (
                        <InputRightElement p="0" color="brand.secondary">
                            {rightIconButton}
                        </InputRightElement>
                    )}

                    <ChakraInput
                        p="0"
                        pl={leftIcon ? '24px' : '0'}
                        {...field}
                        {...props}
                        borderColor={error ? 'brand.error' : 'inherit'}
                        _hover={{ borderColor: error ? 'brand.error' : 'inherit' }}
                    />
                    {loading && (
                        <InputRightElement color="brand.error">
                            <Spinner size="sm" color="brand.dark" />
                        </InputRightElement>
                    )}
                    {error ? (
                        <Tooltip label={errorLabel}>
                            <InputRightElement color="brand.error">{errorIcon}</InputRightElement>
                        </Tooltip>
                    ) : null}
                </InputGroup>
            </Box>
        );
    },
);

Input.defaultProps = {
    loading: undefined,
    field: {},
    error: false,
    errorLabel: '',
    errorIcon: <SbErrorCircleIcon />,
    label: '',
    required: false,
    customClass: '',
};

export const TextArea: FunctionComponent<TextareaProps> = ({
    label,
    field,
    error,
    errorLabel,
    errorIcon,
    required,
    customClass,
    ...props
}) => {
    return (
        <Box className={`sb-input-wrapper ${customClass}`}>
            {label && <Label label={label} required={required} />}
            <InputGroup variant="brand">
                <Textarea
                    px="0"
                    {...field}
                    {...props}
                    className="sb-input"
                    borderRadius="0"
                    borderColor={error ? 'brand.error' : 'inherit'}
                />
                {error ? (
                    <Tooltip label={errorLabel}>
                        <InputRightElement color="brand.error" h="0">
                            {errorIcon}
                        </InputRightElement>
                    </Tooltip>
                ) : null}
            </InputGroup>
        </Box>
    );
};

TextArea.defaultProps = {
    loading: undefined,
    field: {},
    error: false,
    errorLabel: '',
    errorIcon: <SbErrorCircleIcon />,
    label: '',
    required: false,
    customClass: '',
};
