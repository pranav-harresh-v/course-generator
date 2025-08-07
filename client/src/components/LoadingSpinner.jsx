import { Center, Spinner } from "@chakra-ui/react";

const LoadingSpinner = () => {
  return (
    <Center h="100vh">
      <Spinner size="xl" color="teal.500" />
    </Center>
  );
};

export default LoadingSpinner;
