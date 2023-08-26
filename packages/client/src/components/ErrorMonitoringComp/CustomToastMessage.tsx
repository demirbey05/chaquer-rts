import { useToast } from "@chakra-ui/react";
import { createStandaloneToast } from '@chakra-ui/react'

interface CustomToastMessagePropTypes {
    title: string | undefined,
    message: string | undefined
}

export const CustomToastMessage = (props: CustomToastMessagePropTypes) => {
    const toast = useToast()
    const { ToastContainer } = createStandaloneToast()

    toast({
        title: `${props.title}`,
        description: `${props.message}`,
        status: "error",
        isClosable: true,
        position: "bottom-right",
        duration: 5000,
        variant: "left-accent"
    })

    return <ToastContainer />
};
