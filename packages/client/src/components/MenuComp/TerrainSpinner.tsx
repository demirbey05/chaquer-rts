import { Spinner, Alert, AlertIcon } from '@chakra-ui/react'

function MySpinner() {
  return (
    <div className="flex flex-col justify-center items-center gap-y-20" style={{width:"700px", height:"700px"}}>
        <Alert status='info' variant='left-accent'>
        <AlertIcon />
            Please wait few seconds. The new terrain is being generated...
        </Alert>
        <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
        />
    </div>
  )
}

export default MySpinner
